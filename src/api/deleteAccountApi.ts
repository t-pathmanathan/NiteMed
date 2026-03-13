/**
 * deleteAccountApi
 *
 * Handles deletion of the authenticated user's account.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Sends a request to permanently delete the user's account.
 */
export const deleteAccountApi = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE_URL}/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle API errors
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to delete account");
  }

  return response.json();
};
