// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import Toast from "react-native-toast-message";

// export default function ScanQRScreen() {
//   const router = useRouter();
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false);

//   if (!permission) return <View />;

//   if (!permission.granted) {
//     return (
//       <View style={styles.center}>
//         <Text>Camera permission is required</Text>

//         <Pressable style={styles.button} onPress={requestPermission}>
//           <Text style={{ color: "white", fontWeight: "600" }}>
//             Grant Permission
//           </Text>
//         </Pressable>

//         <Pressable style={styles.cancel} onPress={() => router.back()}>
//           <Text style={{ color: "#FD1101", marginTop: 16 }}>Cancel</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   const handleBarcodeScanned = ({ data }: { data: string }) => {
//     if (scanned) return;

//     if (!data.startsWith("NM:")) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid QR Code",
//         text2: "This QR code is not recognized by Nitemed",
//         position: "top",
//       });
//       return;
//     }

//     setScanned(true);

//     // Strip the prefix and pass only the actual code
//     const code = data.replace("NM:", "");
//     router.replace({
//       pathname: "/receiver/(tabs)/ReceiverSettingsScreen",
//       params: { scannedCode: code },
//     });
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <CameraView
//         style={{ flex: 1 }}
//         barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
//         onBarcodeScanned={handleBarcodeScanned}
//       />

//       {/* Overlay */}
//       <View style={styles.overlay}>
//         {/* Transparent darkened background */}
//         <View style={styles.mask} />

//         {/* Frame */}
//         <View style={styles.frameContainer}>
//           <View style={styles.frame}></View>
//           <Text style={styles.instruction}>Scan QR Code From Patient</Text>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   button: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: "#FD1101",
//     borderRadius: 8,
//     minWidth: 140,
//     alignItems: "center",
//   },
//   cancel: {
//     marginTop: 16,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   mask: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   frameContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   frame: {
//     width: 250,
//     height: 250,
//     borderWidth: 2,
//     borderColor: "#FD1101",
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "transparent",
//   },
//   scanLine: {
//     height: 2,
//     backgroundColor: "#FD1101",
//     width: "100%",
//   },
//   instruction: {
//     marginTop: 12,
//     color: "#FFF",
//     fontWeight: "600",
//     fontSize: 14,
//     textAlign: "center",
//   },
// });
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

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
          <Text style={{ color: "white", fontWeight: "600" }}>
            Grant Permission
          </Text>
        </Pressable>

        <Pressable style={styles.cancel} onPress={() => router.back()}>
          <Text style={{ color: "#FD1101", marginTop: 16 }}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    if (!data.startsWith("NM:")) {
      Toast.show({
        type: "error",
        text1: "Invalid QR Code",
        text2: "This QR code is not recognized by Nitemed",
        position: "top",
      });
      return;
    }

    setScanned(true);

    const code = data.replace("NM:", "");
    router.replace({
      pathname: "/receiver/(tabs)/ReceiverSettingsScreen",
      params: { scannedCode: code },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Frame only, no dark overlay */}
      <View style={styles.frameContainer}>
        <View style={styles.frame}></View>
        <Text style={styles.instruction}>Scan QR Code From Patient</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#FD1101",
    borderRadius: 8,
    minWidth: 140,
    alignItems: "center",
  },
  cancel: {
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
    borderColor: "#FD1101",
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
});
