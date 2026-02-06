import LabeledGeneralInput from "@/components/LabeledGeneralInput";
import LabeledPasswordInput from "@/components/LabeledPasswordInput";
import MainButton from "@/components/MainButton";
import { signInApi } from "@/src/api/authApi";
import { bootstrapUserApi } from "@/src/api/userApi";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../theme";

import { saveExpoPushToken } from "@/src/api/registerNotificationApi";
import { registerPushNotifications } from "@/src/utils/registerPushNotifications";
import * as SecureStore from "expo-secure-store";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = emailRegex.test(email) && password.length > 0;

  const handleSignIn = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      await signInApi({
        email,
        password,
      });

      await SecureStore.setItemAsync("hasSignedInBefore", "true");

      const userProfile = await bootstrapUserApi();

      const token = await registerPushNotifications();

      if (token) {
        await saveExpoPushToken(token);
      }

      if (userProfile.role === "takesMeds") {
        router.push("/sender/(tabs)/SenderHomeScreen");
      } else if (userProfile.role === "tracksMeds") {
        router.push("/receiver/(tabs)/ReceiverHomeScreen");
      } else {
        throw new Error("Invalid user role");
      }
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
    marginBottom: 150,
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
    marginTop: 250,
  },
});
