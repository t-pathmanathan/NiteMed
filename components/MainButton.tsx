/**
 * MainButton
 *
 * Primary call-to-action button used across the app.
 * Supports custom colors, disabled state, and press feedback.
 */

import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import { COLORS, FONTS } from "../theme";

const { width } = Dimensions.get("window");

type MainButtonProps = {
  /** Text displayed inside the button */
  title: string;

  /** Function executed when the button is pressed */
  onPress?: () => void;

  /** Optional background color override */
  backgroundColor?: string;

  /** Optional text color override */
  textColor?: string;

  /** Disables button interaction */
  disabled?: boolean;

  /** Optional identifier used for testing */
  testID?: string;
};

export default function MainButton({
  title,
  onPress,
  backgroundColor = COLORS.white,
  textColor = COLORS.black,
  disabled = false,
  testID,
}: MainButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={!disabled ? onPress : undefined}
      accessibilityRole="button"
      accessibilityLabel={`${title} Button`}
      style={({ pressed }) => [
        styles.mainButton,
        { backgroundColor },
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.mainButtonText, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    marginBottom: 55,
    width: width * 0.9,
    height: 70,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  mainButtonText: {
    fontSize: 36,
    fontFamily: FONTS.poppins,
    paddingVertical: 8,
  },

  disabledButton: {
    opacity: 0.4,
  },

  pressed: {
    opacity: 0.75,
  },
});
