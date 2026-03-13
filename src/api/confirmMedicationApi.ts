/**
 * confirmMedicationApi
 *
 * Sends a medication confirmation event to the backend.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Confirms that the user has taken their medication.
 * The request is authenticated using the user's Cognito ID token.
 */
export async function confirmMedicationApi() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await fetch(`${API_BASE_URL}/confirm-medication`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle API errors
  if (!res.ok) {
    const text = await res.text();
    console.error("Confirm medication failed:", text);
    throw new Error("Failed to confirm medication");
  }

  return res.json();
}
