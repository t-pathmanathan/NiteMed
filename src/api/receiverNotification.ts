/**
 * receiverNotification
 *
 * Handles sending reminder notifications ("nudges")
 * from a receiver to a sender.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Sends a reminder notification to the sender associated with the user.
 */
export async function sendNudge(senderId: string) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/receiver-notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ senderId }),
  });

  // Handle API errors
  if (!res.ok) {
    throw new Error("Failed to send nudge");
  }

  return res.json();
}
