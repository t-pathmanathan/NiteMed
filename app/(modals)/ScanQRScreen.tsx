/**
 * ScanQRScreen
 *
 * Allows receivers to scan a sender's QR code to link accounts.
 *
 * Responsibilities:
 * - Request and manage camera permissions
 * - Scan QR codes using the device camera
 * - Validate QR codes for the NiteMed format
 * - Extract the link code from the QR data
 * - Navigate back to ReceiverSettingsScreen with the scanned code
 */

import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const PRIMARY_RED = "#FD1101";
const QR_PREFIX = "NM:";

export default function ScanQRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission is required</Text>

        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>

        <Pressable style={styles.cancel} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    if (!data.startsWith(QR_PREFIX)) {
      Toast.show({
        type: "error",
        text1: "Invalid QR Code",
        text2: "This QR code is not recognized by NiteMed",
        position: "top",
      });

      return;
    }

    setScanned(true);

    const code = data.replace(QR_PREFIX, "");

    router.replace({
      pathname: "/receiver/(tabs)/ReceiverSettingsScreen",
      params: { scannedCode: code },
    });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Cancel</Text>
      </Pressable>

      <View style={styles.frameContainer}>
        <View style={styles.frame} />
        <Text style={styles.instruction}>Scan QR Code From Patient</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: PRIMARY_RED,
    borderRadius: 8,
    minWidth: 140,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },

  cancel: {
    marginTop: 16,
  },

  cancelText: {
    color: PRIMARY_RED,
    marginTop: 16,
  },

  frameContainer: {
    position: "absolute",
    top: "30%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  frame: {
    width: 250,
    height: 250,
    borderWidth: 5,
    borderColor: PRIMARY_RED,
    borderRadius: 12,
    backgroundColor: "transparent",
  },

  instruction: {
    marginTop: 12,
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  backText: {
    color: "white",
    fontWeight: "600",
  },
});
