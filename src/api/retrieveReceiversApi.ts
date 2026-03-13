/**
 * retrieveReceiversApi
 *
 * Retrieves the list of receivers linked to the authenticated sender.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

/**
 * Fetches all receivers associated with the current user.
 */
export async function getMyReceivers() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/retrieve-receivers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle API errors
  if (!res.ok) throw new Error("Failed to fetch receivers");

  return res.json();
}
