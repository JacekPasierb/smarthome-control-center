const API_URL = "http://localhost:4000";

export async function ping() {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("Backend nie odpowiada");
  return res.json() as Promise<{ok: boolean}>;
}
