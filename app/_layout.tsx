import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Amplify } from "aws-amplify";
import { Stack } from "expo-router";
import { Text } from "react-native";

import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack initialRouteName="RegistrationScreen">
      <Stack.Screen
        name="RegistrationScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
