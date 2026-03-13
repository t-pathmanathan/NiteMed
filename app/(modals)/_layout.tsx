/**
 * Modals Layout
 *
 * Provides a modal presentation wrapper for screens inside the (modals) route group.
 *
 * Responsibilities:
 * - Display modal screens above the main app
 * - Provide slide-up modal animation
 * - Render modal content using Expo Router's Slot
 */

import { Slot } from "expo-router";
import { Modal, StyleSheet, View } from "react-native";

export default function ModalsLayout() {
  return (
    <Modal animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={styles.container}>
        <Slot />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // Transparent so camera or underlying UI remains visible
    backgroundColor: "transparent",
  },
});
