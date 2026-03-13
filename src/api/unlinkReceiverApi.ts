/**
 * unlinkReceiverApi
 *
 * Handles unlinking a receiver from the authenticated sender.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Removes a receiver association from the current user.
 */
export const unlinkReceiverApi = async (receiverId: string) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/unlink-receiver`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receiverId }),
  });

  // Handle API errors
  if (!res.ok) throw new Error("Unlink failed");

  return res.json();
};
