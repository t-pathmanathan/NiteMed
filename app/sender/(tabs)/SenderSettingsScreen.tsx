/**
 * SenderSettingsScreen
 *
 * Settings interface for Sender users in NiteMed.
 *
 * Features:
 * - View account information
 * - Display link code for receiver connection
 * - Manage linked receivers
 * - Toggle notification preferences
 * - Handle sign-out and account deletion
 */

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";

import { deleteAccountApi } from "@/src/api/deleteAccountApi";
import { getNotificationPreference } from "@/src/api/notificationPreferenceApi";
import { getMyReceivers } from "@/src/api/retrieveReceiversApi";
import { toggleNotification } from "@/src/api/toggleNotificationApi";
import { unlinkReceiverApi } from "@/src/api/unlinkReceiverApi";
import { bootstrapUserApi } from "@/src/api/userApi";

const QR_PREFIX = "NM:";

// -----------------------------------------
// TYPES
// -----------------------------------------

type UserProfile = {
  fullName: string;
  email: string;
};

type Receiver = {
  userId: string;
  name: string;
  createdAt?: string;
  status?: "active";
};

type SettingItem =
  | { type: "fullName" }
  | { type: "email" }
  | { type: "deleteAccount" }
  | { type: "linkCodeCard" }
  | { type: "toggleNotifications" }
  | { type: "signOut" }
  | { type: "loading" }
  | { type: "empty" }
  | Receiver;

type SettingsSection = {
  title: string;
  data: SettingItem[];
};

// -----------------------------------------
// MAIN SCREEN
// -----------------------------------------

export default function SenderSettingsScreen() {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [notificationsEnabled, setNotificationsEnabled] = useState<
    boolean | null
  >(null);

  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [loadingLinkCode, setLoadingLinkCode] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);

  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [loadingReceivers, setLoadingReceivers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // -----------------------------------------
  // LOAD PROFILE
  // -----------------------------------------

  /**
   * Loads the sender's basic account information
   * from AWS Cognito user attributes.
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const attrs = await fetchUserAttributes();

        setUserProfile({
          fullName: attrs.name ?? "Unknown",
          email: attrs.email ?? "Unknown",
        });
      } catch {
        Toast.show({
          type: "error",
          text1: "Account Error",
          text2: "Failed to load account information",
          position: "top",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // -----------------------------------------
  // LOAD LINK CODE
  // -----------------------------------------

  /**
   * Loads the sender's unique link code used
   * to connect receivers.
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await bootstrapUserApi();
        setLinkCode(user.linkCode ?? null);
      } catch {
        Toast.show({
          type: "error",
          text1: "Code Error",
          text2: "Failed to load link code",
          position: "top",
        });
      } finally {
        setLoadingLinkCode(false);
      }
    };

    loadUser();
  }, []);

  // -----------------------------------------
  // LOAD CONNECTIONS (Reusable)
  // -----------------------------------------

  /**
   * Loads all receivers connected to the sender.
   * This is used both on initial load and refresh.
   */
  const loadConnections = async () => {
    try {
      const res = await getMyReceivers();

      const mappedReceivers: Receiver[] = res.connections.map((c: any) => ({
        userId: c.userId,
        name: c.fullName,
        createdAt: c.createdAt,
        status: "active",
      }));

      setReceivers(mappedReceivers);
    } catch {
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Failed to load linked receivers",
        position: "top",
      });
    } finally {
      setLoadingReceivers(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadConnections();
  }, []);

  // -----------------------------------------
  // LOAD NOTIFICATION PREFERENCE
  // -----------------------------------------

  /**
   * Retrieves the sender's notification preference.
   */
  const loadNotificationPreference = async () => {
    try {
      const res = await getNotificationPreference();
      setNotificationsEnabled(res.notificationsEnabled ?? true);
    } catch {
      Toast.show({
        type: "error",
        text1: "Notification Error",
        text2: "Failed to load notification preference",
        position: "top",
      });

      setNotificationsEnabled(true);
    }
  };

  useEffect(() => {
    loadNotificationPreference();
  }, []);

  /**
   * Refresh data when the screen becomes focused.
   */
  useFocusEffect(
    useCallback(() => {
      loadConnections();
      loadNotificationPreference();
    }, []),
  );

  // -----------------------------------------
  // HANDLERS
  // -----------------------------------------

  /**
   * Unlinks a receiver from the sender account.
   */
  const handleUnlinkReceiver = async (receiverId: string) => {
    try {
      await unlinkReceiverApi(receiverId);
      await loadConnections();
    } catch {
      Toast.show({
        type: "error",
        text1: "Unlink Failed",
        text2: "Failed to unlink receiver",
        position: "top",
      });
    }
  };

  /**
   * Toggles sender notification preferences.
   * Uses optimistic UI update for responsiveness.
   */
  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);

    try {
      await toggleNotification(value);
    } catch {
      Toast.show({
        type: "error",
        text1: "Notification Error",
        text2: "Failed to update notification preference",
        position: "top",
      });

      setNotificationsEnabled(!value);
    }
  };

  /**
   * Signs the user out of the application.
   */
  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      router.replace("/LoginScreen");
    } catch {
      Toast.show({
        type: "error",
        text1: "Sign-Out Failed",
        text2: "Failed to sign out",
        position: "top",
      });
    }
  };

  /**
   * Permanently deletes the sender's account.
   */
  const confirmDeleteAccount = async () => {
    try {
      await deleteAccountApi();
      await signOut({ global: true });
      router.replace("/LoginScreen");
    } catch {
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Failed to delete account",
        position: "top",
      });
    }
  };

  /**
   * Prompts the user before deleting their account.
   */
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all linked data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDeleteAccount },
      ],
    );
  };

  // -----------------------------------------
  // SECTIONS
  // -----------------------------------------

  const SECTIONS: SettingsSection[] = [
    {
      title: "Account",
      data: loadingProfile
        ? [{ type: "loading" }]
        : [{ type: "fullName" }, { type: "email" }],
    },
    {
      title: "Link Code",
      data: [{ type: "linkCodeCard" }],
    },
    {
      title: "Linked Receivers",
      data: loadingReceivers
        ? [{ type: "loading" }]
        : receivers.length === 0
          ? [{ type: "empty" }]
          : receivers,
    },
    {
      title: "Notifications",
      data: [{ type: "toggleNotifications" }],
    },
    {
      title: "Session",
      data: [{ type: "signOut" }, { type: "deleteAccount" }],
    },
  ];

  // -----------------------------------------
  // RENDER ITEM
  // -----------------------------------------

  const renderItem = ({
    item,
    section,
  }: {
    item: SettingItem;
    section: SettingsSection;
  }) => {
    if ("type" in item && item.type === "loading") {
      return (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#FD1101" />
        </View>
      );
    }

    if ("type" in item && item.type === "empty") {
      return (
        <View style={styles.emptyRow}>
          <Text style={styles.emptyText}>No linked receivers yet</Text>
        </View>
      );
    }

    if (section.title === "Linked Receivers" && "name" in item) {
      return <ReceiverRow receiver={item} onUnlink={handleUnlinkReceiver} />;
    }

    if ("type" in item) {
      switch (item.type) {
        case "fullName":
          return <SettingRow label={userProfile?.fullName ?? ""} />;

        case "email":
          return <SettingRow label={userProfile?.email ?? ""} />;

        case "deleteAccount":
          return (
            <SettingRow
              label="Delete Account"
              onPress={handleDeleteAccount}
              right={<AntDesign name="delete" size={20} color="#FD1101" />}
            />
          );

        case "linkCodeCard":
          return (
            <LinkCodeCard
              linkCode={linkCode}
              loading={loadingLinkCode}
              onGenerateQR={() => setQrVisible(true)}
            />
          );

        case "toggleNotifications":
          return (
            <SettingRow
              label="Allow Notifications"
              right={
                <Switch
                  value={notificationsEnabled ?? false}
                  onValueChange={handleToggleNotifications}
                  disabled={notificationsEnabled === null}
                  thumbColor={notificationsEnabled ? "#FD1101" : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: "#ffd6d3" }}
                />
              }
            />
          );

        case "signOut":
          return (
            <SettingRow
              label="Sign Out"
              onPress={handleSignOut}
              right={<AntDesign name="logout" size={20} color="#FD1101" />}
            />
          );
      }
    }

    return null;
  };

  // -----------------------------------------
  // SCREEN RENDER
  // -----------------------------------------

  return (
    <View style={styles.container}>
      <SectionList
        sections={SECTIONS}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadConnections();
            }}
            tintColor="#FD1101"
          />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* QR CODE MODAL */}
      <Modal
        visible={qrVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setQrVisible(false)}
      >
        <View style={qrStyles.overlay}>
          <View style={qrStyles.modalCard}>
            <Text style={qrStyles.title}>Show QR Code To Caregiver</Text>

            {linkCode && <QRCode value={`NM:${linkCode}`} size={220} />}

            <Text style={qrStyles.code}>{linkCode}</Text>

            <Pressable
              style={qrStyles.closeBtn}
              onPress={() => setQrVisible(false)}
            >
              <Text style={qrStyles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

//
// ============================================================
// REUSABLE COMPONENTS
// ============================================================
//

type SettingRowProps = {
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
};

/**
 * Generic row component used throughout the settings screen.
 */
const SettingRow: React.FC<SettingRowProps> = ({ label, right, onPress }) => (
  <Pressable onPress={onPress} style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    {right}
  </Pressable>
);

type LinkCodeCardProps = {
  linkCode: string | null;
  loading: boolean;
  onGenerateQR: () => void;
};

/**
 * Card displaying the sender link code with options to
 * generate a QR code or copy the code to clipboard.
 */
const LinkCodeCard: React.FC<LinkCodeCardProps> = ({
  linkCode,
  loading,
  onGenerateQR,
}) => {
  const handleCopyCode = async () => {
    if (!linkCode) return;

    await Clipboard.setStringAsync(linkCode);

    Toast.show({
      type: "success",
      text1: "Copied!",
      text2: "Link code copied to clipboard",
      position: "top",
    });
  };

  if (loading) {
    return (
      <View style={styles.senderCard}>
        <Text style={{ color: "gray" }}>Loading link code...</Text>
      </View>
    );
  }

  if (!linkCode) {
    return (
      <View style={styles.senderCard}>
        <Text style={{ color: "gray" }}>No link code available</Text>
      </View>
    );
  }

  return (
    <View style={styles.senderCard}>
      <Text style={styles.senderCardCode}>{linkCode}</Text>

      <View style={styles.senderCardButtons}>
        <Pressable style={styles.senderBtn} onPress={onGenerateQR}>
          <AntDesign name="qrcode" size={20} color="#FD1101" />
          <Text style={styles.senderBtnText}>Generate QR Code</Text>
        </Pressable>

        <Pressable style={styles.senderBtn} onPress={handleCopyCode}>
          <Feather name="copy" size={20} color="#FD1101" />
          <Text style={styles.senderBtnText}>Copy Code</Text>
        </Pressable>
      </View>
    </View>
  );
};

type ReceiverRowProps = {
  receiver: Receiver;
  onUnlink: (id: string) => void;
};

/**
 * Row displaying a connected receiver with unlink option.
 */
const ReceiverRow: React.FC<ReceiverRowProps> = ({ receiver, onUnlink }) => (
  <View style={styles.receiverRow}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Text style={styles.receiverName}>{receiver.name}</Text>

      <View style={[styles.statusBadge, styles.badgeTaken]}>
        <Text style={{ fontSize: 12, color: "#2E7D32" }}>Active</Text>
      </View>
    </View>

    <Pressable onPress={() => onUnlink(receiver.userId)}>
      <Text style={{ color: "#FD1101", fontWeight: "600" }}>Unlink</Text>
    </Pressable>
  </View>
);

//
// ============================================================
// STYLES
// ============================================================
//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FD1101",
    paddingTop: 12,
  },

  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 6,
  },

  row: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowLabel: {
    fontSize: 16,
    color: "#111",
  },

  receiverRow: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  receiverName: {
    fontSize: 16,
    fontWeight: "500",
  },

  loadingRow: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },

  emptyRow: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },

  emptyText: {
    color: "#999",
    fontSize: 14,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  badgeTaken: {
    backgroundColor: "#D6F5D6",
  },

  senderCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },

  senderCardCode: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 22,
    color: "#111",
  },

  senderCardButtons: {
    width: "100%",
    gap: 12,
    alignItems: "center",
  },

  senderBtn: {
    width: "90%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FD1101",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  senderBtnText: {
    fontSize: 15,
    color: "#FD1101",
    fontWeight: "600",
  },
});

const qrStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: "85%",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  code: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: "#FD1101",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },

  closeText: {
    color: "white",
    fontWeight: "600",
  },
});
