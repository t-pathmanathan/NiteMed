import { getReceiverHome } from "@/src/api/readMedicationApi";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { sendNudge } from "@/src/api/receiverNotification";

type Sender = {
  id: string;
  name: string;
  status: "taken" | "not-taken";
  lastTaken?: number;
};

export default function ReceiverHomeScreen() {
  const [senders, setSenders] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nudgeCooldowns, setNudgeCooldowns] = useState<Record<string, number>>(
    {},
  );

  // ✅ Reusable load function
  const loadReceiverHome = async () => {
    try {
      const res = await getReceiverHome();

      const mappedSenders: Sender[] = res.senders.map((s: any) => ({
        id: s.senderId,
        name: s.fullName,
        status: s.status === "TAKEN" ? "taken" : "not-taken",
        lastTaken: s.timestamp ? Date.parse(s.timestamp) : undefined,
      }));

      setSenders(mappedSenders);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load sender data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    loadReceiverHome();
  }, []);

  // ✅ Auto refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadReceiverHome();
    }, []),
  );

  const handleNudge = async (sender: Sender) => {
    if (nudgeCooldowns[sender.id] > 0) return;

    try {
      const COOLDOWN_SECONDS = 30;

      // Start countdown
      setNudgeCooldowns((prev) => ({
        ...prev,
        [sender.id]: COOLDOWN_SECONDS,
      }));

      await sendNudge(sender.id);

      // Countdown interval
      const interval = setInterval(() => {
        setNudgeCooldowns((prev) => {
          const remaining = (prev[sender.id] || 0) - 1;

          if (remaining <= 0) {
            clearInterval(interval);
            return {
              ...prev,
              [sender.id]: 0,
            };
          }

          return {
            ...prev,
            [sender.id]: remaining,
          };
        });
      }, 1000);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Nudge Failed",
        text2: "Failed to nudge",
        position: "top",
      });

      // Reset immediately if failed
      setNudgeCooldowns((prev) => ({
        ...prev,
        [sender.id]: 0,
      }));
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------- UI STATES ----------

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (senders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No senders linked yet.</Text>
      </View>
    );
  }

  // ---------- MAIN RENDER ----------

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Senders</Text>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadReceiverHome();
            }}
            tintColor="white"
          />
        }
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
      >
        {senders.map((sender) => (
          <View key={sender.id} style={styles.card}>
            {/* HEADER ROW */}
            <View style={styles.headerRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {sender.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <Text style={styles.senderName} numberOfLines={1}>
                {sender.name}
              </Text>

              <TouchableOpacity
                style={[
                  styles.nudgeButton,
                  nudgeCooldowns[sender.id] > 0 && { opacity: 0.5 },
                ]}
                disabled={nudgeCooldowns[sender.id] > 0}
                onPress={() => handleNudge(sender)}
              >
                <Text style={styles.nudgeText}>
                  {nudgeCooldowns[sender.id] > 0
                    ? `Wait ${nudgeCooldowns[sender.id]}s`
                    : "Nudge"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* INFO SECTION */}
            <View style={styles.infoContainer}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoTitle}>Medication Status</Text>
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
                      color: sender.status === "taken" ? "#333" : "#B30000",
                      fontWeight: "700",
                    }}
                  >
                    {sender.status === "taken" ? "Taken" : "Not Taken"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoColumn}>
                <Text style={styles.infoTitle}>Time Taken</Text>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>
                    {formatTime(sender.lastTaken)}
                  </Text>
                </View>
              </View>
            </View>
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
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  statusBadge: {
    alignItems: "center",
    paddingHorizontal: 20,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FD1101",
  },
  errorText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FD1101",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  senderName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 12,
  },
  infoColumn: {
    flex: 1,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "700",
    marginBottom: 6,
  },
  timeBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
