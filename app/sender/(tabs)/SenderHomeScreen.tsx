import MedicationConfirmCard from "@/components/MedicationConfirmCard";
import { cancelMedication } from "@/src/api/cancelMedicationApi";
import { confirmMedicationApi } from "@/src/api/confirmMedicationApi";
import { getMyReceivers } from "@/src/api/retrieveReceiversApi";
import { senderNotification } from "@/src/api/senderNotificationApi";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SenderHomeScreen() {
  const [receivers, setReceivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // -----------------------------------------
  // LOAD RECEIVERS
  // -----------------------------------------

  const loadReceivers = async () => {
    try {
      const res = await getMyReceivers();
      setReceivers(res.connections ?? []);
    } catch (err) {
      console.error("Failed to load receivers", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadReceivers();
  }, []);

  // Auto refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      loadReceivers();
    }, []),
  );

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadReceivers();
  };

  // -----------------------------------------
  // CONFIRM HANDLER
  // -----------------------------------------

  const handleConfirm = async () => {
    try {
      await confirmMedicationApi();
      await senderNotification();
      console.log("Medication confirmed");
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "We couldn't confirm your check-in. Please try again.",
      );
      throw err;
    }
  };

  // -----------------------------------------
  // CANCEL HANDLER
  // -----------------------------------------

  const handleCancel = async () => {
    try {
      await cancelMedication();
      console.log("Medication canceled");
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "We couldn't cancel your confirmation. Please try again.",
      );
      throw err;
    }
  };

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#FFFFFF"
        />
      }
    >
      <Text style={styles.header}>Check In</Text>

      <View style={styles.cardContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : receivers.length === 0 ? (
          <Text style={styles.emptyText}>No registered receivers</Text>
        ) : (
          <MedicationConfirmCard
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FD1101",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
