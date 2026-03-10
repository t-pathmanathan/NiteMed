import { Slot } from "expo-router";
import { Modal, StyleSheet, View } from "react-native";

export default function ModalsLayout() {
  return (
    <Modal
      animationType="slide" // Modal slides up from bottom
      transparent={true} // Background stays visible
      presentationStyle="overFullScreen"
    >
      <View style={styles.container}>
        <Slot />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // Keep camera visible underneath
  },
});
