/**
 * unlinkSenderApi
 *
 * Handles unlinking a sender from the authenticated receiver.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Removes a sender association from the current user.
 */
export const unlinkSenderApi = async (senderId: string) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/unlink-sender`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderId }),
  });

  // Handle API errors
  if (!res.ok) throw new Error("Unlink failed");

  return res.json();
};
