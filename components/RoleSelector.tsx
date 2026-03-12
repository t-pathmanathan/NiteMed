/**
 * RoleSelector
 *
 * Allows the user to choose their role during onboarding
 * or registration.
 */

import { Checkbox } from "expo-checkbox";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../theme";

type RoleSelectorProps = {
  /** Currently selected role */
  role: string | null;

  /** Updates the selected role */
  setRole: (role: string) => void;

  /** Optional identifier used for testing */
  testID?: string;
};

export default function RoleSelector({ role, setRole }: RoleSelectorProps) {
  return (
    <>
      <Text style={styles.label}>Who are you?</Text>

      <View style={styles.checkboxSection}>
        <Checkbox
          style={styles.checkbox}
          value={role === "takesMeds"}
          onValueChange={() => setRole("takesMeds")}
          color={role === "takesMeds" ? "#FD1101" : undefined}
          testID="role_takesMeds"
        />
        <Text style={styles.checkboxLabel}>I take medication</Text>
      </View>

      <View style={styles.checkboxSection}>
        <Checkbox
          style={styles.checkbox}
          value={role === "tracksMeds"}
          onValueChange={() => setRole("tracksMeds")}
          color={role === "tracksMeds" ? "#FD1101" : undefined}
          testID="role_tracksMeds"
        />
        <Text style={styles.checkboxLabel}>I track others' medication</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    alignSelf: "flex-start",
    marginLeft: 25,
    fontSize: 16,
    fontFamily: FONTS.poppins,
    color: "white",
    marginBottom: 1,
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
});
