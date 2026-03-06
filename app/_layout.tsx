import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Amplify } from "aws-amplify";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform, Text } from "react-native";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";

import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

// 👇 Foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const toastConfig = {
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#FD1101",
        borderLeftWidth: 5,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
      }}
      text2Style={{
        fontSize: 14,
        color: "#333",
      }}
    />
  ),

  success: (props: any) => (
    <SuccessToast
      {...props}
      style={{
        borderLeftColor: "#FD1101",
        borderLeftWidth: 5,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
      }}
      text2Style={{
        fontSize: 14,
        color: "#333",
      }}
    />
  ),
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  // 👇 Create Android notification channel ON APP START
  useEffect(() => {
    if (Platform.OS === "android") {
      // 🔹 Default channel (Confirm notifications)
      Notifications.setNotificationChannelAsync("default", {
        name: "Default Notifications",
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
        enableLights: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      // 🚨 Alarm channel (Nudge notifications)
      Notifications.setNotificationChannelAsync("alarm-channel", {
        name: "Medication Alarm",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 500, 500, 500, 500],
        enableVibrate: true,
        enableLights: true,
        bypassDnd: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StartScreen" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="RegistrationScreen" />
        <Stack.Screen name="ForgotPasswordScreen" />
        <Stack.Screen name="ResetPasswordScreen" />
        <Stack.Screen name="VerifyScreen" />
      </Stack>

      <Toast config={toastConfig} />
    </>
  );
}
