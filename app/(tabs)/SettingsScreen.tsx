import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

// -----------------------------------------
// TYPES
// -----------------------------------------

type Receiver = {
  id: number;
  name: string;
  status: "active" | "inactive";
};

type SettingItem =
  | { type: "fullName" }
  | { type: "email" }
  | { type: "changePassword" }
  | { type: "deleteAccount" }
  | { type: "linkCodeCard" }
  | { type: "toggleNotifications" }
  | { type: "appVersion" }
  | { type: "privacyPolicy" }
  | { type: "termsOfService" }
  | Receiver; // For Registered Receivers section

type SettingsSection = {
  title: string;
  data: SettingItem[];
};

// -----------------------------------------
// MAIN SCREEN
// -----------------------------------------

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const receivers: Receiver[] = [
    { id: 1, name: "Receiver 1", status: "active" },
    { id: 2, name: "Receiver 2", status: "inactive" },
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
      data: [{ type: "linkCodeCard" }],
    },
    {
      title: "Registered Receivers",
      data: receivers,
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
    // Receiver rows — identified by section title + presence of name property
    if (
      section.title === "Registered Receivers" &&
      "name" in item &&
      "status" in item
    ) {
      return <ReceiverRow receiver={item} />;
    }

    // Typed switch for settings rows
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

        case "linkCodeCard":
          return <LinkCodeCard />;

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
// REUSABLE COMPONENTS (with types)
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

const LinkCodeCard: React.FC = () => {
  const linkCode = "93KD-TY72";

  return (
    <View style={styles.senderCard}>
      {/* Link Code Display */}
      <Text style={styles.senderCardCode}>{linkCode}</Text>

      {/* Buttons stacked vertically */}
      <View style={styles.senderCardButtons}>
        <Pressable style={styles.senderBtn}>
          <AntDesign
            name="qrcode"
            size={20}
            color="#FD1101"
            style={styles.senderIcon}
          />
          <Text style={styles.senderBtnText}>Generate QR Code</Text>
        </Pressable>

        <Pressable style={styles.senderBtn}>
          <Feather
            name="copy"
            size={20}
            color="#FD1101"
            style={styles.senderIcon}
          />
          <Text style={styles.senderBtnText}>Copy Code</Text>
        </Pressable>
      </View>
    </View>
  );
};

type ReceiverRowProps = {
  receiver: Receiver;
};

const ReceiverRow: React.FC<ReceiverRowProps> = ({ receiver }) => (
  <View style={styles.receiverRow}>
    <View>
      <Text style={styles.receiverName}>{receiver.name}</Text>
      <Text
        style={{
          color: receiver.status === "active" ? "green" : "gray",
          fontSize: 12,
        }}
      >
        {receiver.status}
      </Text>
    </View>

    <Pressable>
      <Text style={{ color: "#FD1101", fontWeight: "600" }}>Remove</Text>
    </Pressable>
  </View>
);

//
// -----------------------------------------
// STYLES
// -----------------------------------------

const styles = StyleSheet.create({
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
    textAlign: "center",
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

  senderIcon: {
    marginRight: 4,
  },

  senderBtnText: {
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

  cardCode: {
    fontSize: 22,
    fontWeight: "bold",
  },

  cardButtons: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },

  cardBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
  },

  cardBtnText: {
    fontSize: 14,
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
