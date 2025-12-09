import LabeledGeneralInput from "@/components/LabeledGeneralInput";
import LabeledPasswordInput from "@/components/LabeledPasswordInput";
import MainButton from "@/components/MainButton";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../theme";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = emailRegex.test(email) && password.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Login</Text>
      <LabeledGeneralInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <LabeledPasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.forgotPasswordContainer} onPress={() => {}}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>
      <View style={styles.buttonContainer}>
        <MainButton title="Login" onPress={() => {}} disabled={!isFormValid} />
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
