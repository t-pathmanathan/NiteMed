/**
 * LabeledGeneralInput
 *
 * Reusable labeled text input component used across form screens.
 * Displays a label above a styled TextInput for consistent UI.
 */

import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, FONTS } from "../theme";

type LabeledInputProps = {
  /** Text displayed above the input field */
  label: string;

  /** Current value of the input */
  value: string;

  /** Callback triggered when the input text changes */
  onChangeText: (text: string) => void;

  /** Keyboard type shown to the user */
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";

  /** Auto-capitalization behavior */
  autocapitalize?: "none" | "sentences" | "words" | "characters";

  /** Optional identifier used for testing */
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
