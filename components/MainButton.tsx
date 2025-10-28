import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import { COLORS, FONTS } from "../theme";

const { width } = Dimensions.get("window");

export default function MainButton({
  title,
  onPress,
  backgroundColor = COLORS.white,
  textColor = COLORS.black,
}: {
  title: string;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
}) {
  return (
    <Pressable
      style={[styles.mainButton, { backgroundColor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title} Button`}
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
});
