import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://aagvjd6mke.execute-api.us-east-1.amazonaws.com";

export async function cancelMedication() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await fetch(`${API_BASE_URL}/cancel-medication`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to cancel medication");
  }

  return res.json();
}
