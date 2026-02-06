import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerPushNotifications() {
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  console.log("📱 Expo Push Token:", token);

  return token;
}
