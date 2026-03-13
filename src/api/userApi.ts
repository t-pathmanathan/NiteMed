/**
 * userApi
 *
 * Handles user-related API operations such as bootstrapping
 * the authenticated user's profile from the backend.
 */

import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

export type BootstrapUserResponse = {
  userId: string;
  email: string;
  fullName: string;
  role: "takesMeds" | "tracksMeds";
  linkCode?: string;
  createdAt: string;
};

/**
 * Retrieves the authenticated user's profile from the backend.
 * This endpoint is typically called after login to initialize
 * the application state.
 */
export const bootstrapUserApi = async (): Promise<BootstrapUserResponse> => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  // Ensure the user is authenticated before making the request
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`${API_BASE_URL}/bootstrap-user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Handle API errors
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Bootstrap user failed");
  }

  return response.json();
};
