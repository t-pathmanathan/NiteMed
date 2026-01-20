// src/api/unlinkApi.ts
import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

export const unlinkSenderApi = async (senderId: string) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE_URL}/unlink-connection`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unlink failed");
  }

  return response.json();
};
