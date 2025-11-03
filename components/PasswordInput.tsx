import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { FONTS } from "../theme";

type PasswordInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function PasswordInput({
  value,
  onChangeText,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.passwordContainer}>
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
  passwordContainer: {
    width: "90%",
    height: 50,
    marginBottom: 30,
    position: "relative",
    alignSelf: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
