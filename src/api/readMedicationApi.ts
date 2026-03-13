/**
 * readMedicationApi
 *
 * Retrieves medication-related data for the receiver's home screen.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Fetches the receiver's home screen medication data.
 */
export async function getReceiverHome() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await fetch(`${API_BASE_URL}/read-medication`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle API errors
  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch receiver home failed:", text);
    throw new Error("Failed to fetch receiver home data");
  }

  return res.json();
}
