import PasswordStrengthIndicator, {
  StrengthLevel,
} from "@/components/PasswordStrengthIndicator";
import { COLORS, FONTS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type PasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  showStrengthIndicator?: boolean;
  onStrengthChange?: (strength: StrengthLevel) => void;
  testID?: string;
  variant?: "dark" | "light";
};

const getStrength = (password: string): StrengthLevel => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial)
    return "Strong";
  if (
    password.length >= 6 &&
    ((hasLower && hasUpper) ||
      (hasLower && hasNumber) ||
      (hasNumber && hasSpecial))
  )
    return "Medium";
  return "Weak";
};

export default function LabeledPasswordInput({
  label,
  value,
  onChangeText,
  showStrengthIndicator = false,
  onStrengthChange,
  testID,
  variant = "dark",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const strength: StrengthLevel = getStrength(value);
  const showIndicator = showStrengthIndicator && (focused || value.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, variant === "light" && styles.labelLight]}>
          {label}
        </Text>
        {showIndicator && (
          <PasswordStrengthIndicator strength={strength} visible={true} />
        )}
      </View>

      <View
        style={[
          styles.inputWrapper,
          variant === "light" && styles.inputWrapperLight,
        ]}
      >
        <TextInput
          style={[styles.input, variant === "light" && styles.inputLight]}
          secureTextEntry={!visible}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (showStrengthIndicator && onStrengthChange) {
              const newStrength = getStrength(text);
              onStrengthChange(newStrength);
            }
          }}
          autoCapitalize="none"
          testID={testID}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        <Pressable
          onPress={() => setVisible(!visible)}
          style={({ pressed }) => [
            styles.eyeIcon,
            { opacity: pressed ? 0.4 : 1 },
          ]}
        >
          <Ionicons
            name={visible ? "eye-off" : "eye"}
            size={24}
            color={variant === "light" ? "#000" : COLORS.white}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginBottom: 30,
    alignSelf: "center",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.poppins,
  },
  inputWrapper: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 45,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.poppins,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  labelLight: {
    color: "#000",
  },

  inputWrapperLight: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#000",
  },

  inputLight: {
    color: "#000",
  },
});
