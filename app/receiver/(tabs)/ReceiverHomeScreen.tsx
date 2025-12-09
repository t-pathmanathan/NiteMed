import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Sender = {
  id: string;
  name: string;
  status: "taken" | "not-taken";
  lastTaken?: number;
};

export default function ReceiverHomeScreen() {
  // Placeholder senders (until backend is implemented)
  const senders: Sender[] = [
    {
      id: "1",
      name: "Dad",
      status: "taken",
      lastTaken: Date.now() - 1000 * 60 * 45, // 45 mins ago
    },
    {
      id: "2",
      name: "Mom",
      status: "not-taken",
    },
  ];

  const handleNudge = (sender: Sender) => {
    console.log(`Nudged ${sender.name}`);
    // Later: trigger backend → push notification + alarm
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "No data yet";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Senders</Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
      >
        {senders.map((sender) => (
          <View key={sender.id} style={styles.card}>
            {/* Left icon */}
            <View style={styles.iconCircle}>
              <MaterialIcons name="person" size={28} color="white" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.senderName}>{sender.name}</Text>

              {/* Status badge */}
              <View
                style={[
                  styles.statusBadge,
                  sender.status === "taken"
                    ? styles.badgeTaken
                    : styles.badgeNotTaken,
                ]}
              >
                <Text
                  style={{
                    color: sender.status === "taken" ? "#0E7C0E" : "#B30000",
                    fontWeight: "700",
                  }}
                >
                  {sender.status === "taken" ? "Taken" : "Not Taken"}
                </Text>
              </View>

              <Text style={styles.timestampText}>
                Last taken: {formatTime(sender.lastTaken)}
              </Text>
            </View>

            {/* Nudge button */}
            <TouchableOpacity
              style={styles.nudgeButton}
              onPress={() => handleNudge(sender)}
            >
              <Text style={styles.nudgeText}>Nudge</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FD1101",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginTop: 50,
    marginBottom: 20,
    marginLeft: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    marginVertical: 10,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconCircle: {
    width: 50,
    height: 50,
    backgroundColor: "#FD1101",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  senderName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeTaken: {
    backgroundColor: "#D6F5D6",
  },
  badgeNotTaken: {
    backgroundColor: "#FFD6D6",
  },
  timestampText: {
    fontSize: 12,
    color: "#555",
  },
  nudgeButton: {
    backgroundColor: "#FD1101",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginLeft: 12,
  },
  nudgeText: {
    color: "white",
    fontWeight: "700",
  },
});
