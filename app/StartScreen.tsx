import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";

import MainButton from "@/components/MainButton";
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

  const handlePress = () => {
    if (hasAccount) {
      router.push("/LoginScreen");
    } else {
      router.push("/RegistrationScreen");
    }
  };

  // Optional: avoid rendering before check completes
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
