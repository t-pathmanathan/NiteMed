// import { useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function VerifyScreen() {
//   const [code, setCode] = useState("");

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <View style={styles.card}>
//         <Text style={styles.title}>Verify Your Account</Text>

//         <Text style={styles.subtitle}>
//           Enter the 6-digit code sent to your email
//         </Text>

//         <TextInput
//           value={code}
//           onChangeText={setCode}
//           keyboardType="number-pad"
//           maxLength={6}
//           placeholder="● ● ● ● ● ●"
//           placeholderTextColor="#999"
//           style={styles.input}
//         />

//         <TouchableOpacity style={styles.verifyButton}>
//           <Text style={styles.verifyButtonText}>Verify</Text>
//         </TouchableOpacity>

//         <TouchableOpacity>
//           <Text style={styles.resendText}>Resend code</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const PRIMARY_RED = "#FD1101";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     padding: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 24,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "700",
//     color: "#000",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 28,
//   },
//   input: {
//     borderWidth: 1.5,
//     borderColor: "#000",
//     borderRadius: 10,
//     paddingVertical: 14,
//     fontSize: 20,
//     textAlign: "center",
//     letterSpacing: 10,
//     marginBottom: 20,
//     color: "#000",
//   },
//   verifyButton: {
//     backgroundColor: PRIMARY_RED,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   verifyButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//     letterSpacing: 0.5,
//   },
//   resendText: {
//     textAlign: "center",
//     color: PRIMARY_RED,
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });

import { confirmSignUpApi, resendCodeApi } from "@/src/api/authApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await confirmSignUpApi(email, code);
      Alert.alert("Success", "Email verified!");
      router.replace("/LoginScreen"); // prevent back navigation
    } catch (err: any) {
      Alert.alert("Verification Failed", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendCodeApi(email);
      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email."
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Verify Your Account</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="● ● ● ● ● ●"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={loading}>
          <Text style={styles.resendText}>Resend code</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const PRIMARY_RED = "#FD1101";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 14,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 10,
    marginBottom: 20,
    color: "#000",
  },
  verifyButton: {
    backgroundColor: PRIMARY_RED,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  resendText: {
    textAlign: "center",
    color: PRIMARY_RED,
    fontSize: 14,
    fontWeight: "600",
  },
});
