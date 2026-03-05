import { getCurrentUser } from "@aws-amplify/auth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";

import MainButton from "@/components/MainButton";
import { bootstrapUserApi } from "@/src/api/userApi";

import { COLORS, FONTS } from "../theme";

const backgroundImage = require("../assets/images/start-screen-background.jpg");

export default function StartScreen() {
  const router = useRouter();
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccountStatus = async () => {
      const value = await SecureStore.getItemAsync("hasSignedInBefore");
      setHasAccount(value === "true");
    };

    checkAccountStatus();
  }, []);

  const navigateToHome = async () => {
    const userProfile = await bootstrapUserApi();

    if (userProfile.role === "takesMeds") {
      router.replace("/sender/(tabs)/SenderHomeScreen");
    } else {
      router.replace("/receiver/(tabs)/ReceiverHomeScreen");
    }
  };

  const tryAutoLogin = async () => {
    try {
      const rememberMe = await SecureStore.getItemAsync("rememberMe");

      if (rememberMe !== "true") {
        router.push("/LoginScreen");
        return;
      }

      await getCurrentUser();

      await navigateToHome();
    } catch {
      router.push("/LoginScreen");
    }
  };

  const handlePress = () => {
    tryAutoLogin();
  };

  if (hasAccount === null) {
    return null;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Text style={styles.appTitle}>NiteMed</Text>

      <MainButton
        title={hasAccount ? "Check In" : "Start"}
        onPress={handlePress}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
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
