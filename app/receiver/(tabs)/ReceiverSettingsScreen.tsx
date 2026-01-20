import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { getMyConnections } from "@/src/api/connectionsApi"; // ✅ NEW
import { linkReceiverApi } from "@/src/api/linkApi";
import { unlinkSenderApi } from "@/src/api/unlinkApi";

// -----------------------------------------
// TYPES
// -----------------------------------------

type Sender = {
  userId: string;
  name: string;
  createdAt?: string;
  status?: "active";
};

type SettingItem =
  | { type: "fullName" }
  | { type: "email" }
  | { type: "changePassword" }
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

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [enteredCode, setEnteredCode] = useState("");
  const [linking, setLinking] = useState(false);

  const [senders, setSenders] = useState<Sender[]>([]);
  const [loadingSenders, setLoadingSenders] = useState(true);

  // -----------------------------------------
  // LOAD CONNECTIONS
  // -----------------------------------------

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const res = await getMyConnections();

        setSenders(
          res.connections.map((c: any) => ({
            userId: c.userId,
            name: c.fullName,
            createdAt: c.createdAt,
            status: "active",
          })),
        );
      } catch (error) {
        Alert.alert("Error", "Failed to load registered senders");
      } finally {
        setLoadingSenders(false);
      }
    };

    loadConnections();
  }, []);

  // -----------------------------------------
  // LINK HANDLER
  // -----------------------------------------

  const handleLinkSender = async () => {
    if (!enteredCode.trim()) {
      Alert.alert("Error", "Please enter a link code");
      return;
    }

    try {
      setLinking(true);
      await linkReceiverApi(enteredCode.trim().toUpperCase());
      Alert.alert("Success", "Sender linked successfully");
      setEnteredCode("");

      // 🔁 Refresh list
      setLoadingSenders(true);
      const res = await getMyConnections();

      setSenders(
        res.connections.map((c: any) => ({
          userId: c.userId,
          name: c.fullName,
          createdAt: c.createdAt,
          status: "active",
        })),
      );
    } catch (error) {
      Alert.alert(
        "Link Failed",
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLinking(false);
      setLoadingSenders(false);
    }
  };

  const handleUnlinkSender = async (senderId: string) => {
    try {
      await unlinkSenderApi(senderId);

      setSenders((prev) => prev.filter((s) => s.userId !== senderId));
    } catch (err) {
      Alert.alert("Error", "Failed to unlink sender");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      router.replace("/LoginScreen");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  // -----------------------------------------
  // SECTIONS
  // -----------------------------------------

  const SECTIONS: SettingsSection[] = [
    {
      title: "Account",
      data: [
        { type: "fullName" },
        { type: "email" },
        { type: "changePassword" },
        { type: "deleteAccount" },
      ],
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
      data: [{ type: "signOut" }],
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
    // ✅ LOADING STATE
    if ("type" in item && item.type === "loading") {
      return (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#FD1101" />
        </View>
      );
    }

    // ✅ EMPTY STATE
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
          return (
            <SettingRow
              label="Full Name"
              right={<Feather name="edit" size={20} />}
            />
          );

        case "email":
          return (
            <SettingRow
              label="Email"
              right={<Feather name="edit" size={20} />}
            />
          );

        case "changePassword":
          return (
            <SettingRow
              label="Change Password"
              right={<Feather name="edit" size={20} />}
            />
          );

        case "deleteAccount":
          return (
            <SettingRow
              label="Delete Account"
              right={<Text style={{ color: "red" }}>Delete</Text>}
            />
          );

        case "receiverLinkCode":
          return (
            <ReceiverLinkCodeCard
              enteredCode={enteredCode}
              onChangeCode={setEnteredCode}
              onSubmit={handleLinkSender}
              loading={linking}
            />
          );

        case "toggleNotifications":
          return (
            <SettingRow
              label="Allow Notifications"
              right={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
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
        SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
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

// -----------------------------------------
// RECEIVER LINK CARD
// -----------------------------------------

const ReceiverLinkCodeCard = ({
  enteredCode,
  onChangeCode,
  onSubmit,
  loading,
}: {
  enteredCode: string;
  onChangeCode: (t: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) => (
  <View style={styles.receiverCard}>
    <TextInput
      placeholder="Enter Link Code"
      value={enteredCode}
      onChangeText={onChangeCode}
      style={styles.receiverInput}
      autoCapitalize="characters"
    />

    <View style={styles.receiverButtons}>
      <Pressable style={styles.receiverScanBtn}>
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
          <Text style={styles.receiverPrimaryText}>Submit / Link Sender</Text>
        )}
      </Pressable>
    </View>
  </View>
);

// -----------------------------------------
// SENDER ROW
// -----------------------------------------

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
  rowLabel: {
    fontSize: 16,
  },
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
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  receiverButtons: {
    width: "100%",
    gap: 12,
    alignItems: "center",
  },
  receiverPrimaryBtn: {
    width: "90%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FD1101",
    alignItems: "center",
  },
  receiverPrimaryText: {
    color: "white",
    fontWeight: "600",
  },
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
  receiverScanText: {
    color: "#FD1101",
    fontWeight: "600",
  },
  receiverRow: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
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

  senderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  badgeTaken: {
    backgroundColor: "#D6F5D6",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
