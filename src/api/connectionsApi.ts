// src/api/connectionsApi.ts
import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

export async function getMyConnections() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString(); // match linkApi.ts

  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await fetch(`${API_BASE_URL}/retrieve-connections`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch connections failed:", res.status, text);
    throw new Error("Failed to fetch connections");
  }

  return res.json();
}
