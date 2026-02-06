import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

export async function saveExpoPushToken(expoPushToken: string) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) throw new Error("No auth token found");

  const res = await fetch(`${API_BASE_URL}/notification-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      expoPushToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to save push token: ${text}`);
  }

  return res.json();
}
