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
      <Stack.Screen name="StartScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
