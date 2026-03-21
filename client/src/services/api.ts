const API_URL = "http://localhost:4000";

export async function ping() {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("Backend nie odpowiada");
  return res.json() as Promise<{ok: boolean}>;
}

export async function login(payload: {login: string; password: string}) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Błąd logowania");

  return data as {ok: boolean; user?: {login: string; role: string}};
}

export async function getSettings() {
    const res = await fetch(`${API_URL}/api/settings`);
    if (!res.ok) throw new Error("Nie udało się pobrać ustawień");
    return res.json() as Promise<{ homeTitle: string; contactEmail: string }>;
}


export async function updateSettings(payload: { homeTitle: string; contactEmail: string }) {
    const res = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Błąd zapisu");
    return data as { homeTitle: string; contactEmail: string };
}

export type Device = {
  id: string;
  name: string;
  online: boolean;
  lastValue: number;
  lastSeen: number;
};

export async function getDevices() {
  const res = await fetch(`${API_URL}/api/devices`);
  if (!res.ok) throw new Error("Nie udało się pobrać urządzeń");
  return res.json() as Promise<Device[]>;
}