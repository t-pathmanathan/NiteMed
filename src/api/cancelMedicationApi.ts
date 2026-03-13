/**
 * cancelmedicationApi
 *
 * Handles medication-related API requests to the backend.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Cancels a previously confirmed medication check-in.
 * Sends an authenticated request to the backend API.
 */
export async function cancelMedication() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await fetch(`${API_BASE_URL}/cancel-medication`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle API failure
  if (!res.ok) {
    throw new Error("Failed to cancel medication");
  }

  return res.json();
}
