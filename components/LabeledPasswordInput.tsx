/**
 * LabeledPasswordInput
 *
 * Reusable password input component with:
 * - show/hide password toggle
 * - optional password strength indicator
 * - optional info icon for password requirements
 *
 * Used across authentication screens for consistent password handling.
 */

import PasswordStrengthIndicator, {
  StrengthLevel,
} from "@/components/PasswordStrengthIndicator";
import { COLORS, FONTS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PasswordInputProps = {
  /** Label displayed above the input */
  label: string;

  /** Current password value */
  value: string;

  /** Callback triggered when the password changes */
  onChangeText: (text: string) => void;

  /** Whether the strength indicator should be displayed */
  showStrengthIndicator?: boolean;

  /** Optional callback when password strength changes */
  onStrengthChange?: (strength: StrengthLevel) => void;

  /** Optional identifier used for testing */
  testID?: string;

  /** Visual variant for different backgrounds */
  variant?: "dark" | "light";

  /** Whether to show the info icon beside the label */
  showInfoIcon?: boolean;

  /** Message displayed when the info icon is pressed */
  infoMessage?: string;
};

/**
 * Determines the strength level of a password based on
 * length and character diversity.
 */
const getStrength = (password: string): StrengthLevel => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) {
    return "Strong";
  }

  if (
    password.length >= 6 &&
    ((hasLower && hasUpper) ||
      (hasLower && hasNumber) ||
      (hasNumber && hasSpecial))
  ) {
    return "Medium";
  }

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
  showInfoIcon = false,
  infoMessage = "Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 symbol.",
}: PasswordInputProps) {
  /** Controls whether the password is visible */
  const [visible, setVisible] = useState(false);

  /** Tracks focus state to determine when to show the strength indicator */
  const [focused, setFocused] = useState(false);

  const strength: StrengthLevel = getStrength(value);

  /** Show indicator when enabled and the field is focused or has input */
  const showIndicator = showStrengthIndicator && (focused || value.length > 0);

  const handleInfoPress = () => {
    Alert.alert("Password Requirements", infoMessage);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <Text
            style={[styles.label, variant === "light" && styles.labelLight]}
          >
            {label}
          </Text>

          {showInfoIcon && (
            <Pressable
              onPress={handleInfoPress}
              hitSlop={8}
              style={({ pressed }) => [
                styles.infoIconButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={variant === "light" ? "#000" : COLORS.white}
              />
            </Pressable>
          )}
        </View>

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
    gap: 10,
  },

  labelLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },

  label: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.poppins,
  },

  infoIconButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  inputWrapper: {
    width: "100%",
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },

  input: {
    width: "100%",
    minHeight: 50,
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
