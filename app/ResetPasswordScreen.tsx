import { confirmForgotPasswordApi } from "@/src/api/authApi";
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!code || code.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid Code",
        text2: "Please enter the 6-digit code.",
        position: "top",
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Invalid Password",
        text2: "Password must be at least 8 characters long.",
        position: "top",
      });
      return;
    }

    setLoading(true);

    try {
      await confirmForgotPasswordApi({
        email,
        code,
        newPassword,
      });

      Toast.show({
        type: "success",
        text1: "Password Reset",
        text2: "Your password has been successfully updated.",
        position: "top",
      });

      router.replace("/LoginScreen");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: err.message || "Please try again.",
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
        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.subtitle}>
          Enter the code sent to your email and choose a new password
        </Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="● ● ● ● ● ●"
          placeholderTextColor="#999"
          style={styles.codeInput}
        />

        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
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
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  codeInput: {
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
  primaryButton: {
    backgroundColor: PRIMARY_RED,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
