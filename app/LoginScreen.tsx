/**
 * LoginScreen
 *
 * Authenticates an existing user and initializes their session.
 *
 * Responsibilities:
 * - Collect login credentials
 * - Authenticate user with the authentication API
 * - Persist login state locally
 * - Register device for push notifications
 * - Bootstrap the user profile
 * - Navigate to the appropriate home screen based on role
 */

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Toast from "react-native-toast-message";

import LabeledGeneralInput from "@/components/LabeledGeneralInput";
import LabeledPasswordInput from "@/components/LabeledPasswordInput";
import MainButton from "@/components/MainButton";

import { signInApi } from "@/src/api/authApi";
import { saveExpoPushToken } from "@/src/api/registerNotificationApi";
import { bootstrapUserApi } from "@/src/api/userApi";

import { registerPushNotifications } from "@/src/utils/registerPushNotifications";

import { COLORS, FONTS } from "../theme";

/**
 * Regex used to validate email input format.
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * SecureStore key used to detect returning users.
 */
const HAS_SIGNED_IN_KEY = "hasSignedInBefore";

export default function LoginScreen() {
  const router = useRouter();

  /**
   * Form state
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Loading state during authentication
   */
  const [loading, setLoading] = useState(false);

  /**
   * Determine if login form is valid
   */
  const isFormValid = emailRegex.test(email) && password.length > 0;

  /**
   * Handles the login process and session initialization.
   */
  const handleSignIn = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      /**
       * Authenticate user
       */
      await signInApi({
        email,
        password,
      });

      /**
       * Persist login indicator locally
       */
      await SecureStore.setItemAsync(HAS_SIGNED_IN_KEY, "true");

      /**
       * Fetch user profile information
       */
      const userProfile = await bootstrapUserApi();

      /**
       * Register device for push notifications
       */
      const token = await registerPushNotifications();

      if (token) {
        await saveExpoPushToken(token);
      }

      /**
       * Navigate to role-specific home screen
       */
      if (userProfile.role === "takesMeds") {
        router.replace("/sender/(tabs)/SenderHomeScreen");
      } else if (userProfile.role === "tracksMeds") {
        router.replace("/receiver/(tabs)/ReceiverHomeScreen");
      } else {
        throw new Error("Invalid user role");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign-in failed";

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: message,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Login</Text>

      <LabeledGeneralInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        testID="input_email"
      />

      <LabeledPasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        testID="input_password"
      />

      <Pressable
        style={styles.forgotPasswordContainer}
        onPress={() =>
          router.push({
            pathname: "/ForgotPasswordScreen",
            params: email ? { email } : undefined,
          })
        }
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        <MainButton
          title={loading ? "Logging In..." : "Login"}
          onPress={handleSignIn}
          disabled={!isFormValid || loading}
          testID="btn_login"
        />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => router.replace("/RegistrationScreen")}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    paddingBottom: 80,
  },

  screenTitle: {
    fontSize: 48,
    fontFamily: FONTS.poppins,
    color: COLORS.white,
    marginBottom: 100,
    marginTop: 70,
  },

  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginRight: 25,
  },

  forgotPasswordText: {
    color: COLORS.white,
    fontFamily: FONTS.poppins,
    fontSize: 14,
    marginTop: -20,
  },

  buttonContainer: {
    marginTop: 25,
  },

  registerContainer: {
    marginTop: -50,
  },

  registerText: {
    color: COLORS.white,
    fontFamily: FONTS.poppins,
    fontSize: 14,
  },

  registerLink: {
    color: COLORS.white,
    fontFamily: FONTS.poppins,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
