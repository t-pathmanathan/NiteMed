/**
 * PasswordStrengthIndicator
 *
 * Displays a visual indicator of password strength.
 * The text color changes based on the strength level.
 */

import { FONTS } from "@/theme";
import { StyleSheet, Text } from "react-native";

/** Possible password strength levels */
export type StrengthLevel = "Weak" | "Medium" | "Strong";

interface PasswordStrengthIndicatorProps {
  /** Strength value to display */
  strength: StrengthLevel | null;

  /** Controls whether the indicator should be rendered */
  visible: boolean;
}

export default function PasswordStrengthIndicator({
  strength,
  visible,
}: PasswordStrengthIndicatorProps) {
  // Do not render the indicator if it is hidden or no strength is provided
  if (!visible || !strength) return null;

  return (
    <Text
      style={[
        styles.strengthText,
        strength === "Strong"
          ? styles.strong
          : strength === "Medium"
            ? styles.medium
            : styles.weak,
      ]}
    >
      {strength}
    </Text>
  );
}

const styles = StyleSheet.create({
  strengthText: {
    marginLeft: 10,
    fontFamily: FONTS.poppins,
  },

  weak: {
    color: "#FFFFFF",
  },

  medium: {
    color: "#FFB800",
  },

  strong: {
    color: "#00C851",
  },
});
