/**
 * confirmationStatusApi
 *
 * Retrieves the current medication confirmation status for the user.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Fetches the latest medication confirmation status from the backend.
 */
export async function getConfirmationStatus() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await fetch(`${API_BASE_URL}/confirmation-status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle API errors
  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch confirmation status failed:", text);
    throw new Error("Failed to fetch confirmation status");
  }

  // Expected response shape: { confirmed: boolean }
  return res.json();
}
