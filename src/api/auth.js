const API_URL = import.meta.env.VITE_API_URL ?? ''

// The backend reads the Firebase ID token from the Authorization header,
// not a JSON body, so this bypasses the generic client.
export async function login(firebaseIdToken) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${firebaseIdToken}`,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Login failed: ${res.status}`)
  }

  return res.json()
}
