/**
 * RootLayout
 *
 * This is the root layout for the Expo Router application.
 * It is responsible for:
 * - Configuring AWS Amplify
 * - Registering global notification behavior
 * - Initializing Android notification channels
 * - Loading global fonts
 * - Registering top-level navigation routes
 * - Rendering the global Toast notification system
 */

import { useEffect } from "react";
import { Platform, Text } from "react-native";

import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";

import { Amplify } from "aws-amplify";

import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";

import Toast, {
  ErrorToast,
  SuccessToast,
  ToastConfig,
} from "react-native-toast-message";

import outputs from "../amplify_outputs.json";

/**
 * Configure AWS Amplify using generated project outputs.
 * This should run once when the app initializes.
 */
Amplify.configure(outputs);

/**
 * Global foreground notification behavior.
 * Determines how notifications behave while the app is open.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Global Toast configuration.
 * Customizes appearance of success and error toasts across the app.
 */
const toastConfig: ToastConfig = {
  error: (props) => (
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

  success: (props) => (
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
  /**
   * Load global fonts before rendering the app.
   */
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  /**
   * Initialize Android notification channels when the app starts.
   * Required for controlling notification behavior on Android.
   */
  useEffect(() => {
    if (Platform.OS === "android") {
      /**
       * Default notification channel
       * Used for general notifications such as confirmations.
       */
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

      /**
       * Alarm notification channel
       * Used for medication reminder alarms requiring high priority.
       */
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

  /**
   * Prevent rendering the app until fonts are loaded.
   */
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

        {/* Modal route group */}
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>

      {/* Global toast notification renderer */}
      <Toast config={toastConfig} />
    </>
  );
}
