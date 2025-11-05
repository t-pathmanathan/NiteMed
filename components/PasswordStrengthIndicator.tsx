import { FONTS } from "@/theme";
import { StyleSheet, Text } from "react-native";

export type StrengthLevel = "Weak" | "Medium" | "Strong";

interface PasswordStrengthIndicatorProps {
  strength: StrengthLevel | null;
  visible: boolean;
}

export default function PasswordStrengthIndicator({
  strength,
  visible,
}: PasswordStrengthIndicatorProps) {
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
