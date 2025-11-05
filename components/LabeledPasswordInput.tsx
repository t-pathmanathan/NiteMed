import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FONTS } from "../theme";

type PasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function PasswordInput({
  label,
  value,
  onChangeText,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
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
            color="white"
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
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: FONTS.poppins,
    color: "white",
    marginBottom: 1,
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
    color: "white",
    fontSize: 16,
    fontFamily: FONTS.poppins,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
});
