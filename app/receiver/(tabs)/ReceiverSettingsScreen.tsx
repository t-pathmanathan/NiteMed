import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

// -----------------------------------------
// TYPES
// -----------------------------------------

type Sender = {
  id: number;
  name: string;
  status: "active" | "inactive";
};

type SettingItem =
  | { type: "fullName" }
  | { type: "email" }
  | { type: "changePassword" }
  | { type: "deleteAccount" }
  | { type: "receiverLinkCode" }
  | { type: "toggleNotifications" }
  | { type: "appVersion" }
  | { type: "privacyPolicy" }
  | { type: "termsOfService" }
  | Sender; // For Linked Parents section

type SettingsSection = {
  title: string;
  data: SettingItem[];
};

// -----------------------------------------
// MAIN SCREEN
// -----------------------------------------

export default function ReceiverSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [enteredCode, setEnteredCode] = useState("");

  const senders: Sender[] = [
    { id: 1, name: "Sender 1", status: "active" },
    { id: 2, name: "Sender 2", status: "inactive" },
  ];

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
      data: senders,
    },
    {
      title: "Notifications",
      data: [{ type: "toggleNotifications" }],
    },
    {
      title: "About",
      data: [
        { type: "appVersion" },
        { type: "privacyPolicy" },
        { type: "termsOfService" },
      ],
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
    // Sender rows (list of linked senders)
    if (
      section.title === "Registered Senders" &&
      "name" in item &&
      "status" in item
    ) {
      return <SenderRow sender={item} />;
    }

    if ("type" in item) {
      switch (item.type) {
        case "fullName":
          return (
            <SettingRow
              label="Full Name"
              right={<Feather name="edit" size={20} color="black" />}
            />
          );

        case "email":
          return (
            <SettingRow
              label="Email"
              right={<Feather name="edit" size={20} color="black" />}
            />
          );

        case "changePassword":
          return (
            <SettingRow
              label="Change Password"
              right={<Feather name="edit" size={20} color="black" />}
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

        case "appVersion":
          return <SettingRow label="App Version" right={<Text>1.0.0</Text>} />;

        case "privacyPolicy":
          return <SettingRow label="Privacy Policy" />;

        case "termsOfService":
          return <SettingRow label="Terms of Service" />;
      }
    }

    return null;
  };

  // -----------------------------------------
  // RENDER SCREEN
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
        SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

//
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

// // Receiver Link Code — flipped version of sender side

const ReceiverLinkCodeCard = ({
  enteredCode,
  onChangeCode,
}: {
  enteredCode: string;
  onChangeCode: (t: string) => void;
}) => {
  return (
    <View style={styles.receiverCard}>
      {/* Centered input */}
      <TextInput
        placeholder="Enter Link Code"
        value={enteredCode}
        onChangeText={onChangeCode}
        style={styles.receiverInput}
        autoCapitalize="characters"
      />

      {/* Stacked buttons */}
      <View style={styles.receiverButtons}>
        {/* Scan QR button (icon + outline) */}
        <Pressable style={styles.receiverScanBtn}>
          <Feather name="camera" size={20} color="#FD1101" />
          <Text style={styles.receiverScanText}>Scan QR Code</Text>
        </Pressable>

        {/* Submit / Link Account Button */}
        <Pressable style={styles.receiverPrimaryBtn}>
          <Text style={styles.receiverPrimaryText}>Submit / Link Sender</Text>
        </Pressable>
      </View>
    </View>
  );
};

type SenderRowProps = {
  sender: Sender;
};

// Sender list row
const SenderRow: React.FC<SenderRowProps> = ({ sender }) => (
  <View style={styles.receiverRow}>
    <View>
      <Text style={styles.receiverName}>{sender.name}</Text>
      <Text
        style={{
          color: sender.status === "active" ? "green" : "gray",
          fontSize: 12,
        }}
      >
        {sender.status}
      </Text>
    </View>

    <Pressable>
      <Text style={{ color: "#FD1101", fontWeight: "600" }}>Unlink</Text>
    </Pressable>
  </View>
);

//
// -----------------------------------------
// STYLES
// -----------------------------------------

const styles = StyleSheet.create({
  receiverCard: {
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

  receiverInput: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: "#FAFAFA",
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 20,
  },

  receiverButtons: {
    width: "100%",
    gap: 12,
    alignItems: "center",
  },

  receiverPrimaryBtn: {
    width: "90%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#FD1101",
    justifyContent: "center",
    alignItems: "center",
  },

  receiverPrimaryText: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
  },

  receiverScanBtn: {
    width: "90%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FD1101",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  receiverScanText: {
    fontSize: 15,
    color: "#FD1101",
    fontWeight: "600",
  },

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

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },

  cardButtons: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
    alignItems: "center",
  },

  cardBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#FD1101",
    borderRadius: 8,
    alignItems: "center",
  },

  cardBtnText: {
    fontSize: 15,
    color: "white",
    fontWeight: "600",
  },

  qrButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#FD1101",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
});
