import { ImageBackground, StyleSheet, Text } from "react-native";
import { COLORS, FONTS } from "../theme";

import MainButton from "@/components/MainButton";

const backgroundImage = require("../assets/images/start-screen-background.jpg");

export default function StartScreen() {
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Text style={styles.appTitle}>NiteMed</Text>
      <MainButton title="Start" onPress={() => alert("Get Started pressed!")} />
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
