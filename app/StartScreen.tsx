/**
 * StartScreen
 *
 * Landing screen for the NiteMed application.
 *
 * Responsibilities:
 * - Determine if the user has previously signed into the app
 * - Check whether an authenticated session already exists
 * - Route the user to:
 *      • Registration (new user)
 *      • Login (returning user without session)
 *      • Home screen (active session)
 */

import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";

import { getCurrentUser } from "@aws-amplify/auth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import MainButton from "@/components/MainButton";
import { bootstrapUserApi } from "@/src/api/userApi";

import { COLORS, FONTS } from "../theme";

const backgroundImage = require("../assets/images/start-screen-background.jpg");

/**
 * Key used to determine if the user has previously signed into the app.
 */
const HAS_SIGNED_IN_KEY = "hasSignedInBefore";

export default function StartScreen() {
  const router = useRouter();

  /**
   * Tracks whether the device has a previously registered user.
   * null = loading state
   */
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  /**
   * Determine if the user has signed in before.
   * This allows the start screen to decide whether to show
   * "Start" or "Check In".
   */
  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        const storedValue = await SecureStore.getItemAsync(HAS_SIGNED_IN_KEY);
        setHasAccount(storedValue === "true");
      } catch (error) {
        console.error("Failed to read account status from SecureStore", error);
        setHasAccount(false);
      }
    };

    checkAccountStatus();
  }, []);

  /**
   * Fetch the user's profile and navigate to the appropriate home screen.
   * Navigation depends on the user's role.
   */
  const navigateToHome = async () => {
    try {
      const userProfile = await bootstrapUserApi();

      if (userProfile.role === "takesMeds") {
        router.replace("/sender/(tabs)/SenderHomeScreen");
      } else {
        router.replace("/receiver/(tabs)/ReceiverHomeScreen");
      }
    } catch (error) {
      console.error("Failed to bootstrap user profile", error);
      router.push("/LoginScreen");
    }
  };

  /**
   * Main CTA button handler.
   *
   * Flow:
   * 1. New user → Registration
   * 2. Returning user:
   *      - Active session → Home
   *      - No session → Login
   */
  const handlePress = async () => {
    if (!hasAccount) {
      router.push("/RegistrationScreen");
      return;
    }

    try {
      // Check if an authenticated session already exists
      await getCurrentUser();

      // Session exists → navigate directly to home
      await navigateToHome();
    } catch {
      // No active session → send user to login
      router.push("/LoginScreen");
    }
  };

  /**
   * Prevent rendering until account status is determined.
   */
  if (hasAccount === null) {
    return null;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Text style={styles.appTitle}>NiteMed</Text>

      <MainButton
        title={hasAccount ? "Check In" : "Start"}
        onPress={handlePress}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  appTitle: {
    flex: 1,
    marginTop: 50,
    fontSize: 64,
    fontFamily: FONTS.poppins,
    color: COLORS.white,
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});
