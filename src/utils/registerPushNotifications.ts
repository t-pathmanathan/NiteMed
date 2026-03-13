/**
 * registerPushNotifications
 *
 * Handles registration for Expo push notifications and
 * retrieves the device's Expo push token.
 */

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

/**
 * Requests notification permissions and returns the Expo push token
 * if registration succeeds.
 */
export async function registerPushNotifications() {
  if (!Device.isDevice) {
    throw new Error("Must use a physical device for push notifications");
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error("Missing EAS projectId for push notifications");
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  return token;
}
