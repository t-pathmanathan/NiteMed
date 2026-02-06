import MedicationConfirmCard from "@/components/MedicationConfirmCard";
import { confirmMedicationApi } from "@/src/api/confirmMedicationApi";
import { senderNotification } from "@/src/api/sendNotificationApi";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function SenderHomeScreen() {
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
      throw err; // 👈 important so card knows it failed
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Check In</Text>

      {/* 👇 ADD THIS WRAPPER */}
      <View style={styles.cardContainer}>
        <MedicationConfirmCard onConfirm={handleConfirm} />
      </View>
    </View>
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
});
