/**
 * linkApi
 *
 * Handles linking a receiver account using a caregiver-provided link code.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Links the current authenticated user to a receiver account
 * using a provided link code.
 */
export const linkReceiverApi = async (linkCode: string) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE_URL}/link-receiver`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ linkCode }),
  });

  // Handle API errors
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Linking failed");
  }

  return response.json();
};
