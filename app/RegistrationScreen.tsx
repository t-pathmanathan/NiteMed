/*
Things To Do:
- Integrate ScrollView so that keyboard does not cover input fields.
- Implement Password and Confirm Password fields to use secureTextEntry. (Done)
- Implement Password and Confirm Password fields to validate matching passwords.
- Implement Show/Hide Password functionality. (Done)
- Implement Email field to validate proper email format.
- Implement Register Button to not be active unless all fields are filled and valid.

*/

import MainButton from "@/components/MainButton";
import PasswordInput from "@/components/PasswordInput";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FONTS } from "../theme";

export default function RegistrationScreen() {
  const [role, setRole] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Registration</Text>
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} autoCapitalize="words" />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} autoCapitalize="none" />
      <Text style={styles.label}>Password</Text>
      <PasswordInput value={password} onChangeText={setPassword} />
      <Text style={styles.label}>Confirm Password</Text>
      <PasswordInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.checkboxSection}>
        <Checkbox
          style={styles.checkbox}
          value={role === "takesMeds"}
          onValueChange={() => setRole("takesMeds")}
          color={role === "takesMeds" ? "#FD1101" : undefined}
        />
        <Text style={styles.checkboxLabel}>I take medication</Text>
      </View>

      <View style={styles.checkboxSection}>
        <Checkbox
          style={styles.checkbox}
          value={role === "tracksMeds"}
          onValueChange={() => setRole("tracksMeds")}
          color={role === "tracksMeds" ? "#FD1101" : undefined}
        />
        <Text style={styles.checkboxLabel}>I track others' medication</Text>
      </View>

      <View style={styles.buttonContainer}>
        <MainButton title="Register" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FD1101",
  },
  screenTitle: {
    fontSize: 48,
    fontFamily: FONTS.poppins,
    color: "white",
    marginBottom: 40,
    marginTop: 50,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 25,
    fontSize: 16,
    fontFamily: FONTS.poppins,
    color: "white",
    marginBottom: 1,
  },
  input: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
    textAlignVertical: "bottom",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    fontSize: 16,
    fontFamily: FONTS.poppins,
  },
  checkboxSection: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: 25,
    marginBottom: 5,
  },
  checkbox: {
    borderColor: "white",
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "white",
    fontFamily: FONTS.poppins,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
