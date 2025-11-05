import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import { COLORS, FONTS } from "../theme";

const { width } = Dimensions.get("window");

export default function MainButton({
  title,
  onPress,
  backgroundColor = COLORS.white,
  textColor = COLORS.black,
  disabled = false,
}: {
  title: string;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
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
    opacity: 0.4, // visually show disabled state
  },
  pressed: {
    opacity: 0.75, // tap feedback only when active
  },
});
