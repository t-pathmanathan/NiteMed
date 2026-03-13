/**
 * registerPushNotifications
 *
 * Handles registration for Expo push notifications and
 * retrieves the device's Expo push token.
 */

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

/**
 * Requests notification permissions and returns the Expo push token
 * if registration succeeds.
 */
export async function registerPushNotifications() {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Exit if permission is denied
  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return null;
  }

  // Retrieve the Expo push token for this device
  const token = (await Notifications.getExpoPushTokenAsync()).data;

  console.log("📱 Expo Push Token:", token);

  return token;
}
