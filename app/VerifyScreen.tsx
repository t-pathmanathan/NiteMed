import { confirmSignUpApi, resendCodeApi } from "@/src/api/authApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid Code",
        text2: "Please enter the 6-digit code.",
        position: "top",
      });
      return;
    }

    setLoading(true);
    try {
      await confirmSignUpApi({ email, code });

      Toast.show({
        type: "success",
        text1: "Email Verified",
        text2: "Your account has been verified successfully.",
        position: "top",
      });

      router.replace("/LoginScreen");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: err?.message || "Please try again.",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendCodeApi({ email });

      Toast.show({
        type: "success",
        text1: "Code Sent",
        text2: "A new verification code has been sent to your email.",
        position: "top",
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message || "Could not resend code.",
        position: "top",
      });
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
