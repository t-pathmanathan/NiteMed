// import { bootstrapUserApi } from "@/src/api/userApi";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Feather from "@expo/vector-icons/Feather";
// import { signOut } from "aws-amplify/auth";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react"; // ✅ NEW
// import {
//   Pressable,
//   SectionList,
//   StyleSheet,
//   Switch,
//   Text,
//   View,
// } from "react-native";
// // -----------------------------------------
// // TYPES
// // -----------------------------------------

// type Receiver = {
//   id: number;
//   name: string;
//   status: "active" | "inactive";
// };

// type SettingItem =
//   | { type: "fullName" }
//   | { type: "email" }
//   | { type: "changePassword" }
//   | { type: "deleteAccount" }
//   | { type: "linkCodeCard" }
//   | { type: "toggleNotifications" }
//   | { type: "signOut" }
//   | Receiver;

// type SettingsSection = {
//   title: string;
//   data: SettingItem[];
// };

// // -----------------------------------------
// // MAIN SCREEN
// // -----------------------------------------

// export default function SettingsScreen() {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);

//   // ✅ NEW — state for link code
//   const [linkCode, setLinkCode] = useState<string | null>(null);
//   const [loadingLinkCode, setLoadingLinkCode] = useState(true);

//   const receivers: Receiver[] = [
//     { id: 1, name: "Receiver 1", status: "active" },
//     { id: 2, name: "Receiver 2", status: "inactive" },
//   ];

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const user = await bootstrapUserApi();
//         setLinkCode(user.linkCode ?? null);
//       } catch (error) {
//         console.error("Failed to fetch link code", error);
//       } finally {
//         setLoadingLinkCode(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const router = useRouter();

//   const handleSignOut = async () => {
//     try {
//       await signOut({ global: true });

//       // Reset navigation & go to login
//       router.replace("/LoginScreen");
//     } catch (error) {
//       console.error("Failed to sign out", error);
//     }
//   };

//   const SECTIONS: SettingsSection[] = [
//     {
//       title: "Account",
//       data: [
//         { type: "fullName" },
//         { type: "email" },
//         { type: "changePassword" },
//         { type: "deleteAccount" },
//       ],
//     },
//     {
//       title: "Link Code",
//       data: [{ type: "linkCodeCard" }],
//     },
//     {
//       title: "Registered Receivers",
//       data: receivers,
//     },
//     {
//       title: "Notifications",
//       data: [{ type: "toggleNotifications" }],
//     },
//     {
//       title: "Session",
//       data: [{ type: "signOut" }],
//     },
//   ];

//   // -----------------------------------------
//   // RENDER ITEM
//   // -----------------------------------------

//   const renderItem = ({
//     item,
//     section,
//   }: {
//     item: SettingItem;
//     section: SettingsSection;
//   }) => {
//     if (
//       section.title === "Registered Receivers" &&
//       "name" in item &&
//       "status" in item
//     ) {
//       return <ReceiverRow receiver={item} />;
//     }

//     if ("type" in item) {
//       switch (item.type) {
//         case "fullName":
//           return (
//             <SettingRow
//               label="Full Name"
//               right={<Feather name="edit" size={20} color="black" />}
//             />
//           );

//         case "email":
//           return (
//             <SettingRow
//               label="Email"
//               right={<Feather name="edit" size={20} color="black" />}
//             />
//           );

//         case "changePassword":
//           return (
//             <SettingRow
//               label="Change Password"
//               right={<Feather name="edit" size={20} color="black" />}
//             />
//           );

//         case "deleteAccount":
//           return (
//             <SettingRow
//               label="Delete Account"
//               right={<Text style={{ color: "red" }}>Delete</Text>}
//             />
//           );

//         case "linkCodeCard":
//           return <LinkCodeCard linkCode={linkCode} loading={loadingLinkCode} />;

//         case "toggleNotifications":
//           return (
//             <SettingRow
//               label="Allow Notifications"
//               right={
//                 <Switch
//                   value={notificationsEnabled}
//                   onValueChange={setNotificationsEnabled}
//                   thumbColor={notificationsEnabled ? "#FD1101" : "#f4f3f4"}
//                   trackColor={{ false: "#767577", true: "#ffd6d3" }}
//                 />
//               }
//             />
//           );

//         case "signOut":
//           return (
//             <SettingRow
//               label="Sign Out"
//               onPress={handleSignOut}
//               right={<AntDesign name="logout" size={20} color="#FD1101" />}
//             />
//           );
//       }
//     }

//     return null;
//   };

//   // -----------------------------------------
//   // RENDER SCREEN
//   // -----------------------------------------

//   return (
//     <View style={styles.container}>
//       <SectionList
//         sections={SECTIONS}
//         keyExtractor={(_, index) => index.toString()}
//         renderItem={renderItem}
//         renderSectionHeader={({ section }) => (
//           <Text style={styles.sectionHeader}>{section.title}</Text>
//         )}
//         stickySectionHeadersEnabled={false}
//         SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
//         // ✅ ADD THESE
//         contentContainerStyle={{ paddingBottom: 120 }}
//       />
//     </View>
//   );
// }

// // -----------------------------------------
// // REUSABLE COMPONENTS
// // -----------------------------------------

// type SettingRowProps = {
//   label: string;
//   right?: React.ReactNode;
//   onPress?: () => void;
// };

// const SettingRow: React.FC<SettingRowProps> = ({ label, right, onPress }) => (
//   <Pressable onPress={onPress} style={styles.row}>
//     <Text style={styles.rowLabel}>{label}</Text>
//     {right}
//   </Pressable>
// );

// // ✅ UPDATED — accepts linkCode as prop
// type LinkCodeCardProps = {
//   linkCode: string | null;
//   loading: boolean;
// };

// const LinkCodeCard: React.FC<LinkCodeCardProps> = ({ linkCode, loading }) => {
//   if (loading) {
//     return (
//       <View style={styles.senderCard}>
//         <Text style={{ color: "gray" }}>Loading link code...</Text>
//       </View>
//     );
//   }

//   if (!linkCode) {
//     return (
//       <View style={styles.senderCard}>
//         <Text style={{ color: "gray" }}>No link code available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.senderCard}>
//       <Text style={styles.senderCardCode}>{linkCode}</Text>

//       <View style={styles.senderCardButtons}>
//         <Pressable style={styles.senderBtn}>
//           <AntDesign name="qrcode" size={20} color="#FD1101" />
//           <Text style={styles.senderBtnText}>Generate QR Code</Text>
//         </Pressable>

//         <Pressable style={styles.senderBtn}>
//           <Feather name="copy" size={20} color="#FD1101" />
//           <Text style={styles.senderBtnText}>Copy Code</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// type ReceiverRowProps = {
//   receiver: Receiver;
// };

// const ReceiverRow: React.FC<ReceiverRowProps> = ({ receiver }) => (
//   <View style={styles.receiverRow}>
//     <View>
//       <Text style={styles.receiverName}>{receiver.name}</Text>
//       <Text
//         style={{
//           color: receiver.status === "active" ? "green" : "gray",
//           fontSize: 12,
//         }}
//       >
//         {receiver.status}
//       </Text>
//     </View>

//     <Pressable>
//       <Text style={{ color: "#FD1101", fontWeight: "600" }}>Remove</Text>
//     </Pressable>
//   </View>
// );

// // -----------------------------------------
// // STYLES (UNCHANGED)
// // -----------------------------------------

// const styles = StyleSheet.create({
//   senderCard: {
//     backgroundColor: "white",
//     marginHorizontal: 16,
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#E5E5E5",
//     alignItems: "center",
//   },
//   senderCardCode: {
//     fontSize: 28,
//     fontWeight: "bold",
//     letterSpacing: 2,
//     marginBottom: 22,
//     color: "#111",
//   },
//   senderCardButtons: {
//     width: "100%",
//     gap: 12,
//     alignItems: "center",
//   },
//   senderBtn: {
//     width: "90%",
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#FD1101",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 12,
//   },
//   senderBtnText: {
//     fontSize: 15,
//     color: "#FD1101",
//     fontWeight: "600",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#FD1101",
//     paddingTop: 12,
//   },
//   sectionHeader: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#FFF",
//     paddingHorizontal: 16,
//     marginTop: 18,
//     marginBottom: 6,
//   },
//   row: {
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     backgroundColor: "white",
//     borderBottomColor: "#E5E5E5",
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   rowLabel: {
//     fontSize: 16,
//     color: "#111",
//   },
//   receiverRow: {
//     backgroundColor: "white",
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderBottomColor: "#E5E5E5",
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   receiverName: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
// });

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
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
  View,
} from "react-native";

import { deleteAccountApi } from "@/src/api/deleteAccountApi";
import { getMyReceivers } from "@/src/api/retrieveReceiversApi";
import { unlinkReceiverApi } from "@/src/api/unlinkReceiverApi";
import { bootstrapUserApi } from "@/src/api/userApi";

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
  | { type: "changePassword" }
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

export default function SettingsScreen() {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [loadingLinkCode, setLoadingLinkCode] = useState(true);

  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [loadingReceivers, setLoadingReceivers] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const attrs = await fetchUserAttributes();
        setUserProfile({
          fullName: attrs.name ?? "Unknown",
          email: attrs.email ?? "Unknown",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await bootstrapUserApi();
        setLinkCode(user.linkCode ?? null);
      } catch (error) {
        console.error("Failed to fetch link code", error);
      } finally {
        setLoadingLinkCode(false);
      }
    };

    loadUser();
  }, []);

  // -----------------------------------------
  // LOAD CONNECTIONS
  // -----------------------------------------

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const res = await getMyReceivers();

        setReceivers(
          res.connections.map((c: any) => ({
            userId: c.userId,
            name: c.fullName,
            createdAt: c.createdAt,
            status: "active",
          })),
        );
      } catch (error) {
        Alert.alert("Error", "Failed to load registered receivers");
      } finally {
        setLoadingReceivers(false);
      }
    };

    loadConnections();
  }, []);

  const handleUnlinkReceiver = async (receiverId: string) => {
    try {
      setLoadingReceivers(true);

      await unlinkReceiverApi(receiverId);

      const res = await getMyReceivers();
      setReceivers(
        res.connections.map((c: any) => ({
          userId: c.userId,
          name: c.fullName,
          createdAt: c.createdAt,
          status: "active",
        })),
      );
    } catch (err) {
      Alert.alert("Error", "Failed to unlink receiver");
    } finally {
      setLoadingReceivers(false);
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

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all linked data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ],
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccountApi();
      await signOut({ global: true });
      router.replace("/LoginScreen");
    } catch (err) {
      Alert.alert("Error", "Failed to delete account");
    }
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
      title: "Registered Receivers",
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
          <Text style={styles.emptyText}>No registered receivers yet</Text>
        </View>
      );
    }

    if (section.title === "Registered Receivers" && "name" in item) {
      return <ReceiverRow receiver={item} onUnlink={handleUnlinkReceiver} />;
    }

    if ("type" in item) {
      switch (item.type) {
        case "fullName":
          return (
            <SettingRow
              label={`${userProfile ? `${userProfile.fullName}` : ""}`}
            />
          );

        case "email":
          return (
            <SettingRow
              label={`${userProfile ? `${userProfile.email}` : ""}`}
            />
          );

        case "deleteAccount":
          return (
            <SettingRow
              label="Delete Account"
              onPress={handleDeleteAccount}
              right={<AntDesign name="delete" size={20} color="#FD1101" />}
            />
          );

        case "linkCodeCard":
          return <LinkCodeCard linkCode={linkCode} loading={loadingLinkCode} />;

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
        // ✅ ADD THESE
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

// ✅ UPDATED — accepts linkCode as prop
type LinkCodeCardProps = {
  linkCode: string | null;
  loading: boolean;
};

const LinkCodeCard: React.FC<LinkCodeCardProps> = ({ linkCode, loading }) => {
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
        <Pressable style={styles.senderBtn}>
          <AntDesign name="qrcode" size={20} color="#FD1101" />
          <Text style={styles.senderBtnText}>Generate QR Code</Text>
        </Pressable>

        <Pressable style={styles.senderBtn}>
          <Feather name="copy" size={20} color="#FD1101" />
          <Text style={styles.senderBtnText}>Copy Code</Text>
        </Pressable>
      </View>
    </View>
  );
};

const ReceiverRow = ({
  receiver,
  onUnlink,
}: {
  receiver: Receiver;
  onUnlink: (id: string) => void;
}) => (
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

// -----------------------------------------
// STYLES (UNCHANGED)
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

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
