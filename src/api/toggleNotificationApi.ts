/**
 * toggleNotificationApi
 *
 * Updates the user's notification preference.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Enables or disables notifications for the authenticated user.
 */
export async function toggleNotification(notificationsEnabled: boolean) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/notification-toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationsEnabled }),
  });

  // Handle API errors
  if (!res.ok) {
    throw new Error("Failed to update notification preference");
  }

  return res.json();
}
