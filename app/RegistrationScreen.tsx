import LabeledGeneralInput from "@/components/LabeledGeneralInput";
import LabeledPasswordInput from "@/components/LabeledPasswordInput";
import MainButton from "@/components/MainButton";
import { StrengthLevel } from "@/components/PasswordStrengthIndicator";
import RoleSelector from "@/components/RoleSelector";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS, FONTS } from "../theme";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationScreen() {
  const [role, setRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] =
    useState<StrengthLevel>("Weak");

  const isFormValid =
    fullName.trim().length > 0 &&
    emailRegex.test(email) &&
    passwordStrength === "Strong" &&
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
      <LabeledGeneralInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        autocapitalize="words"
      />
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
        showStrengthIndicator={true}
        onStrengthChange={setPasswordStrength}
      />
      <LabeledPasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <RoleSelector role={role} setRole={setRole} />
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
    backgroundColor: COLORS.primary,
  },
  container: {
    alignItems: "center",
    paddingBottom: 80,
  },
  screenTitle: {
    fontSize: 48,
    fontFamily: FONTS.poppins,
    color: COLORS.white,
    marginBottom: 40,
    marginTop: 50,
  },
  buttonContainer: {
    marginTop: 80,
  },
});
