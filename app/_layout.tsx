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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartScreen" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegistrationScreen" />
      <Stack.Screen name="ForgotPasswordScreen" />
      <Stack.Screen name="ResetPasswordScreen" />
      <Stack.Screen name="VerifyScreen" />
    </Stack>
  );
}
