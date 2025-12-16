import LabeledGeneralInput from "@/components/LabeledGeneralInput";
import LabeledPasswordInput from "@/components/LabeledPasswordInput";
import MainButton from "@/components/MainButton";
import { StrengthLevel } from "@/components/PasswordStrengthIndicator";
import RoleSelector from "@/components/RoleSelector";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS, FONTS } from "../theme";

import { registerUser } from "@/src/services/authService";
import { emailRegex } from "@/src/utils/validators";

export default function RegistrationScreen() {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] =
    useState<StrengthLevel>("Weak");
  const [loading, setLoading] = useState(false);

  const isFormValid =
    fullName.trim().length > 0 &&
    emailRegex.test(email) &&
    passwordStrength === "Strong" &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    role !== null;

  const handleSignUp = async () => {
    if (!isFormValid || !role) return;

    setLoading(true);
    try {
      await registerUser({
        email,
        password,
        fullName,
        role,
      });

      router.push({
        pathname: "/VerifyScreen",
        params: { email },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign-up failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.screenTitle}>Registration</Text>

      <LabeledGeneralInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        autocapitalize="words"
        testID="input_fullName"
      />

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
        showStrengthIndicator
        onStrengthChange={setPasswordStrength}
        testID="input_password"
      />

      <LabeledPasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        testID="input_confirmPassword"
      />

      <RoleSelector role={role} setRole={setRole} />

      <View style={styles.buttonContainer}>
        <MainButton
          title={loading ? "Registering..." : "Register"}
          onPress={handleSignUp}
          disabled={!isFormValid || loading}
          testID="btn_register"
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
