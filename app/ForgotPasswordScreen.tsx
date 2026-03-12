/**
 * ForgotPasswordScreen
 *
 * Allows a user to initiate the password reset process.
 *
 * Responsibilities:
 * - Collect the user's email address
 * - Request a password reset code from the authentication API
 * - Notify the user that a reset code has been sent
 * - Navigate to the password reset screen
 */

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

import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { forgotPasswordApi } from "@/src/api/authApi";

/**
 * Primary theme color used for action buttons
 */
const PRIMARY_RED = "#FD1101";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  /**
   * Form state
   */
  const [email, setEmail] = useState("");

  /**
   * Loading state during API request
   */
  const [loading, setLoading] = useState(false);

  /**
   * Handles the request to send a password reset code
   */
  const handleSendCode = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Missing Email",
        text2: "Please enter your email address.",
        position: "top",
      });
      return;
    }

    setLoading(true);

    try {
      /**
       * Request password reset code from authentication API
       */
      await forgotPasswordApi({ email });

      Toast.show({
        type: "success",
        text1: "Code Sent",
        text2: "A password reset code has been sent to your email.",
        position: "top",
      });

      /**
       * Navigate to reset password screen
       */
      router.push({
        pathname: "/ResetPasswordScreen",
        params: { email },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send reset code.";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
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
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.subtitle}>
          Enter your email to receive a reset code
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSendCode}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Sending..." : "Send Code"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
