import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, FONTS } from "../theme";

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autocapitalize?: "none" | "sentences" | "words" | "characters";
  testID?: string;
};

export default function LabeledGeneralInput({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  autocapitalize = "none",
  testID,
}: LabeledInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        autoCapitalize={autocapitalize}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        testID={testID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginBottom: 30,
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: FONTS.poppins,
    color: COLORS.white,
    marginBottom: 1,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.poppins,
  },
});
