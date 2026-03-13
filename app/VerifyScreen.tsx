/**
 * VerifyScreen
 *
 * Handles email verification after user registration.
 *
 * Responsibilities:
 * - Accept the verification code sent to the user's email
 * - Confirm the user's registration with the authentication API
 * - Allow the user to request a new verification code
 * - Redirect the user to the login screen after successful verification
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

import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { confirmSignUpApi, resendCodeApi } from "@/src/api/authApi";

/**
 * Expected length of verification code sent by Cognito
 */
const VERIFICATION_CODE_LENGTH = 6;

/**
 * Primary theme color used for action buttons
 */
const PRIMARY_RED = "#FD1101";

export default function VerifyScreen() {
  const router = useRouter();

  /**
   * Email passed from the registration screen
   */
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email;

  /**
   * Form state
   */
  const [code, setCode] = useState("");

  /**
   * Loading state for verification/resend operations
   */
  const [loading, setLoading] = useState(false);

  /**
   * Handles verification of the user's email code
   */
  const handleVerify = async () => {
    if (!code || code.length !== VERIFICATION_CODE_LENGTH) {
      Toast.show({
        type: "error",
        text1: "Invalid Code",
        text2: `Please enter the ${VERIFICATION_CODE_LENGTH}-digit code.`,
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

      /**
       * Redirect to login screen after successful verification
       */
      router.replace("/LoginScreen");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Please try again.";

      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: message,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Requests a new verification code to be sent to the user's email
   */
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not resend code.";

      Toast.show({
        type: "error",
        text1: "Resend Failed",
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
        <Text style={styles.title}>Verify Your Account</Text>

        <Text style={styles.subtitle}>
          Enter the {VERIFICATION_CODE_LENGTH}-digit code sent to your email
        </Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={VERIFICATION_CODE_LENGTH}
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
