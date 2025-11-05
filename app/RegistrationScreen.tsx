import MainButton from "@/components/MainButton";
import PasswordInput from "@/components/PasswordInput";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FONTS } from "../theme";

export default function RegistrationScreen() {
  const [role, setRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isFormValid =
    fullName.trim().length > 0 &&
    emailRegex.test(email) &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    role !== null;

  return (
    <KeyboardAwareScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.screenTitle}>Registration</Text>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="words"
        value={fullName}
        onChangeText={setFullName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password</Text>
      <PasswordInput value={password} onChangeText={setPassword} />
      <Text style={styles.label}>Confirm Password</Text>
      <PasswordInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Text style={styles.label}>Who are you?</Text>
      <View style={styles.checkboxSection}>
        <Checkbox
          style={styles.checkbox}
          value={role === "takesMeds"}
          onValueChange={() => setRole("takesMeds")}
          color={role === "takesMeds" ? "#FD1101" : undefined}
        />
        <Text style={styles.checkboxLabel}>I take medication</Text>
      </View>

      <View style={styles.checkboxSection}>
        <Checkbox
          style={styles.checkbox}
          value={role === "tracksMeds"}
          onValueChange={() => setRole("tracksMeds")}
          color={role === "tracksMeds" ? "#FD1101" : undefined}
        />
        <Text style={styles.checkboxLabel}>I track others' medication</Text>
      </View>

      <View style={styles.buttonContainer}>
        <MainButton
          title="Register"
          onPress={() => {}}
          disabled={!isFormValid}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FD1101",
  },
  container: {
    alignItems: "center",
    paddingBottom: 80, // allows scrolling above keyboard
  },
  screenTitle: {
    fontSize: 48,
    fontFamily: FONTS.poppins,
    color: "white",
    marginBottom: 40,
    marginTop: 50,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 25,
    fontSize: 16,
    fontFamily: FONTS.poppins,
    color: "white",
    marginBottom: 1,
  },
  input: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
    textAlignVertical: "bottom",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    fontSize: 16,
    fontFamily: FONTS.poppins,
  },
  checkboxSection: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: 25,
    marginBottom: 5,
  },
  checkbox: {
    borderColor: "white",
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "white",
    fontFamily: FONTS.poppins,
  },
  buttonContainer: {
    marginTop: 100,
  },
});
