/**
 * ReceiverSettingsScreen
 *
 * Allows a receiver to manage their account and sender connections.
 *
 * Responsibilities:
 * - Display account information (name and email)
 * - Link senders using a link code or QR scanner
 * - Display and manage registered senders
 * - Allow receivers to unlink senders
 * - Toggle notification preferences
 * - Sign out of the account
 * - Permanently delete the account
 */

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { deleteAccountApi } from "@/src/api/deleteAccountApi";
import { linkReceiverApi } from "@/src/api/linkApi";
import { getNotificationPreference } from "@/src/api/notificationPreferenceApi";
import { getMySenders } from "@/src/api/retrieveSendersApi";
import { toggleNotification } from "@/src/api/toggleNotificationApi";
import { unlinkSenderApi } from "@/src/api/unlinkSenderApi";

// -----------------------------------------
// TYPES
// -----------------------------------------

type UserProfile = {
  fullName: string;
  email: string;
};

type Sender = {
  userId: string;
  name: string;
  createdAt?: string;
  status?: "active";
};

type SettingItem =
  | { type: "fullName" }
  | { type: "email" }
  | { type: "deleteAccount" }
  | { type: "receiverLinkCode" }
  | { type: "toggleNotifications" }
  | { type: "signOut" }
  | { type: "loading" }
  | { type: "empty" }
  | Sender;

type SettingsSection = {
  title: string;
  data: SettingItem[];
};

// -----------------------------------------
// MAIN SCREEN
// -----------------------------------------

export default function ReceiverSettingsScreen() {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [notificationsEnabled, setNotificationsEnabled] = useState<
    boolean | null
  >(null);
  const [enteredCode, setEnteredCode] = useState("");
  const [linking, setLinking] = useState(false);

  const [senders, setSenders] = useState<Sender[]>([]);
  const [loadingSenders, setLoadingSenders] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // -----------------------------------------
  // LOAD PROFILE
  // -----------------------------------------

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

  const handleOpenScanner = () => {
    router.push("/(modals)/ScanQRScreen");
  };

  // -----------------------------------------
  // LOAD CONNECTIONS
  // -----------------------------------------

  const loadConnections = async () => {
    try {
      const res = await getMySenders();

      setSenders(
        res.connections.map((c: any) => ({
          userId: c.userId,
          name: c.fullName,
          createdAt: c.createdAt,
          status: "active",
        })),
      );
    } catch {
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Failed to load registered senders",
        position: "top",
      });
    } finally {
      setLoadingSenders(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  // -----------------------------------------
  // LOAD NOTIFICATION PREFERENCE
  // -----------------------------------------

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

  useFocusEffect(
    useCallback(() => {
      loadConnections();
      loadNotificationPreference();
    }, []),
  );

  // -----------------------------------------
  // HANDLE SCANNED QR CODE
  // -----------------------------------------

  const { scannedCode } = useLocalSearchParams();

  useEffect(() => {
    if (scannedCode) {
      const code = scannedCode as string;

      setEnteredCode(code);
      handleLinkSender(code);
    }
  }, [scannedCode]);

  // -----------------------------------------
  // LINK HANDLER
  // -----------------------------------------

  const handleLinkSender = async (code?: string) => {
    const finalCode = code ?? enteredCode;

    if (!finalCode.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Code",
        text2: "Please enter a link code",
        position: "top",
      });

      return;
    }

    try {
      setLinking(true);

      await linkReceiverApi(finalCode.trim().toUpperCase());

      setEnteredCode("");

      setLoadingSenders(true);
      await loadConnections();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Link Failed",
        text2: error instanceof Error ? error.message : "Something went wrong",
        position: "top",
      });
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkSender = async (senderId: string) => {
    try {
      await unlinkSenderApi(senderId);
      await loadConnections();
    } catch {
      Toast.show({
        type: "error",
        text1: "Unlink Failed",
        text2: "Failed to unlink sender",
        position: "top",
      });
    }
  };

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
      data: [{ type: "receiverLinkCode" }],
    },
    {
      title: "Registered Senders",
      data: loadingSenders
        ? [{ type: "loading" }]
        : senders.length === 0
          ? [{ type: "empty" }]
          : senders,
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
          <Text style={styles.emptyText}>No registered senders yet</Text>
        </View>
      );
    }

    if (section.title === "Registered Senders" && "name" in item) {
      return <SenderRow sender={item} onUnlink={handleUnlinkSender} />;
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

        case "receiverLinkCode":
          return (
            <ReceiverLinkCodeCard
              enteredCode={enteredCode}
              onChangeCode={setEnteredCode}
              onSubmit={handleLinkSender}
              loading={linking}
              onScanPress={handleOpenScanner}
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
    </View>
  );
}

// -----------------------------------------
// REUSABLE COMPONENTS
// -----------------------------------------

type SettingRowProps = {
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
};

const SettingRow: React.FC<SettingRowProps> = ({ label, right, onPress }) => (
  <Pressable onPress={onPress} style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    {right}
  </Pressable>
);

const ReceiverLinkCodeCard = ({
  enteredCode,
  onChangeCode,
  onSubmit,
  loading,
  onScanPress,
}: {
  enteredCode: string;
  onChangeCode: (t: string) => void;
  onSubmit: () => void;
  loading: boolean;
  onScanPress: () => void;
}) => (
  <View style={styles.receiverCard}>
    <TextInput
      placeholder="Enter Link Code"
      value={enteredCode}
      placeholderTextColor={"#AAA"}
      onChangeText={onChangeCode}
      style={styles.receiverInput}
      autoCapitalize="characters"
      maxLength={9}
    />

    <View style={styles.receiverButtons}>
      <Pressable style={styles.receiverScanBtn} onPress={onScanPress}>
        <Feather name="camera" size={20} color="#FD1101" />
        <Text style={styles.receiverScanText}>Scan QR Code</Text>
      </Pressable>

      <Pressable
        style={[styles.receiverPrimaryBtn, loading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={styles.linkContent}>
            <MaterialIcons
              name="connect-without-contact"
              size={24}
              color="white"
            />
            <Text style={styles.receiverPrimaryText}>Link</Text>
          </View>
        )}
      </Pressable>
    </View>
  </View>
);

const SenderRow = ({
  sender,
  onUnlink,
}: {
  sender: Sender;
  onUnlink: (id: string) => void;
}) => (
  <View style={styles.receiverRow}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Text style={styles.receiverName}>{sender.name}</Text>
      <View style={[styles.statusBadge, styles.badgeTaken]}>
        <Text style={{ fontSize: 12, color: "#2E7D32" }}>Active</Text>
      </View>
    </View>

    <Pressable onPress={() => onUnlink(sender.userId)}>
      <Text style={{ color: "#FD1101", fontWeight: "600" }}>Unlink</Text>
    </Pressable>
  </View>
);

// -----------------------------------------
// STYLES
// -----------------------------------------

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
    padding: 16,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: { fontSize: 16 },
  receiverCard: {
    backgroundColor: "white",
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  receiverInput: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingVertical: 18,
    borderRadius: 10,
    marginBottom: 24,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#111",
  },
  receiverButtons: { width: "100%", gap: 12, alignItems: "center" },
  receiverPrimaryBtn: {
    width: "90%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FD1101",
    alignItems: "center",
  },
  receiverPrimaryText: { color: "white", fontWeight: "600" },
  receiverScanBtn: {
    width: "90%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FD1101",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  receiverScanText: { color: "#FD1101", fontWeight: "600" },
  receiverRow: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 6,
    marginRight: 20,
  },
  receiverName: { fontSize: 16, fontWeight: "500" },
  loadingRow: { backgroundColor: "white", padding: 20, alignItems: "center" },
  emptyRow: { backgroundColor: "white", padding: 20, alignItems: "center" },
  emptyText: { color: "#999", fontSize: 14 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeTaken: { backgroundColor: "#D6F5D6" },
});
