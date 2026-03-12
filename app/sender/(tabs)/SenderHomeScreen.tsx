/**
 * SenderHomeScreen
 *
 * Home dashboard for users who take medication.
 *
 * Responsibilities:
 * - Retrieve receivers connected to the sender
 * - Retrieve today's medication confirmation status
 * - Allow sender to confirm medication
 * - Allow sender to cancel confirmation
 * - Support pull-to-refresh and screen focus refresh
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";

import MedicationConfirmCard from "@/components/MedicationConfirmCard";

import { cancelMedication } from "@/src/api/cancelMedicationApi";
import { confirmMedicationApi } from "@/src/api/confirmMedicationApi";
import { getConfirmationStatus } from "@/src/api/confirmationStatusApi";
import { getMyReceivers } from "@/src/api/retrieveReceiversApi";

/**
 * Receiver connection type
 */
type Receiver = {
  receiverId: string;
  name?: string;
};

export default function SenderHomeScreen() {
  /**
   * Connected receivers
   */
  const [receivers, setReceivers] = useState<Receiver[]>([]);

  /**
   * Initial loading state
   */
  const [loading, setLoading] = useState(true);

  /**
   * Pull-to-refresh state
   */
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Medication confirmation state
   */
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);

  // -----------------------------------------
  // LOAD DASHBOARD DATA
  // -----------------------------------------

  const loadData = async () => {
    try {
      const [receiverRes, confirmationRes] = await Promise.all([
        getMyReceivers(),
        getConfirmationStatus(),
      ]);

      setReceivers(receiverRes.connections ?? []);
      setIsConfirmed(confirmationRes.confirmed);
    } catch (error) {
      console.error("Failed to load sender dashboard data", error);

      Toast.show({
        type: "error",
        text1: "Loading Error",
        text2: "Unable to retrieve your data. Please try again.",
        position: "top",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Load data when screen first mounts
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Refresh data whenever screen gains focus
   */
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  /**
   * Pull-to-refresh handler
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // -----------------------------------------
  // CONFIRM MEDICATION
  // -----------------------------------------

  const handleConfirm = async () => {
    try {
      await confirmMedicationApi();
      setIsConfirmed(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Confirmation Failed",
        text2: "We couldn't confirm your check-in. Please try again.",
        position: "top",
      });

      throw error;
    }
  };

  // -----------------------------------------
  // CANCEL CONFIRMATION
  // -----------------------------------------

  const handleCancel = async () => {
    try {
      await cancelMedication();
      setIsConfirmed(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Cancel Failed",
        text2: "We couldn't cancel your confirmation. Please try again.",
        position: "top",
      });

      throw error;
    }
  };

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  const renderContent = () => {
    if (loading || isConfirmed === null) {
      return <ActivityIndicator size="large" color="white" />;
    }

    if (receivers.length === 0) {
      return <Text style={styles.emptyText}>No receivers linked yet.</Text>;
    }

    return (
      <MedicationConfirmCard
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        initialConfirmed={isConfirmed}
      />
    );
  };

  const shouldShowCard =
    !loading && isConfirmed !== null && receivers.length > 0;

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
      {shouldShowCard && <Text style={styles.header}>Check In</Text>}

      <View style={styles.cardContainer}>{renderContent()}</View>
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
