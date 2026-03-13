/**
 * notificationPreferenceApi
 *
 * Retrieves the user's notification preference from the backend.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Fetches the current notification preference for the authenticated user.
 */
export async function getNotificationPreference() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/notification-preference`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle API errors
  if (!res.ok) {
    throw new Error("Failed to fetch notification preference");
  }

  return res.json();
}
