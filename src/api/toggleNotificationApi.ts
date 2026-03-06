import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

export async function toggleNotification(notificationsEnabled: boolean) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/notification-toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationsEnabled }),
  });

  if (!res.ok) {
    throw new Error("Failed to update notification preference");
  }

  return res.json();
}
