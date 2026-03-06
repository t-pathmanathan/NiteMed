import LabeledGeneralInput from "@/components/LabeledGeneralInput";
import LabeledPasswordInput from "@/components/LabeledPasswordInput";
import MainButton from "@/components/MainButton";

import { signInApi } from "@/src/api/authApi";
import { bootstrapUserApi } from "@/src/api/userApi";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import * as SecureStore from "expo-secure-store";

import { Checkbox } from "expo-checkbox";

import { saveExpoPushToken } from "@/src/api/registerNotificationApi";
import { registerPushNotifications } from "@/src/utils/registerPushNotifications";

import { COLORS, FONTS } from "../theme";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = emailRegex.test(email) && password.length > 0;

  const navigateToHome = async () => {
    const userProfile = await bootstrapUserApi();

    if (userProfile.role === "takesMeds") {
      router.replace("/sender/(tabs)/SenderHomeScreen");
    } else if (userProfile.role === "tracksMeds") {
      router.replace("/receiver/(tabs)/ReceiverHomeScreen");
    } else {
      throw new Error("Invalid user role");
    }
  };

  const handleSignIn = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      await signInApi({ email, password });

      await SecureStore.setItemAsync("hasSignedInBefore", "true");

      await SecureStore.setItemAsync(
        "rememberMe",
        rememberMe ? "true" : "false",
      );

      const token = await registerPushNotifications();

      if (token) {
        await saveExpoPushToken(token);
      }

      await navigateToHome();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign-in failed";
      Alert.alert("Error", message);
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

      {/* Remember + Forgot */}
      <View style={styles.optionsRow}>
        <View style={styles.rememberContainer}>
          <Checkbox
            style={styles.checkbox}
            value={rememberMe}
            onValueChange={setRememberMe}
            color={rememberMe ? "#FD1101" : undefined}
            testID="checkbox_rememberMe"
          />
          <Text style={styles.rememberText}>Remember Me</Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/ForgotPasswordScreen",
              params: email ? { email } : undefined,
            })
          }
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <MainButton
          title={loading ? "Logging In..." : "Login"}
          onPress={handleSignIn}
          disabled={!isFormValid || loading}
          testID="btn_login"
        />
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
    marginBottom: 80,
    marginTop: 70,
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    width: "90%", // align closer to input width
    marginTop: -25, // removes awkward vertical gap
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    borderColor: "white",
  },

  rememberText: {
    marginLeft: 8,
    color: COLORS.white,
    fontFamily: FONTS.poppins,
    fontSize: 14,
  },

  forgotPasswordText: {
    color: COLORS.white,
    fontFamily: FONTS.poppins,
    fontSize: 14,
  },

  buttonContainer: {
    marginTop: 225,
  },
});
