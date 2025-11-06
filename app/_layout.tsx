import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack>
      {/* <Stack.Screen name="StartScreen" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen
        name="RegistrationScreen"
        options={{ headerShown: false }}
      />
    </Stack> */}
      <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
