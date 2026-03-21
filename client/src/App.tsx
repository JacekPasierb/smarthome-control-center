import {useEffect, useState} from "react";
import {
  getSettings,
  login as loginRequest,
  updateSettings,
} from "./services/api";
import {getDevices, type Device} from "./services/api";
import {io} from "socket.io-client";

export default function App() {
  const [homeTitle, setHomeTitle] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [devices, setDevices] = useState<Device[]>([]);

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const s = await getSettings();
      setHomeTitle(s.homeTitle);
      setContactEmail(s.contactEmail);

      const d = await getDevices();
      setDevices(d);
    } catch (e: any) {
      setMsg(`X ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const socket = io("http://localhost:4000");

    socket.emit("subscribe", "dev-1");
    socket.on("device-update", (updatedDevice) => {
      setDevices((prev) => prev.map((d) => d.id === updatedDevice.id ? updatedDevice : d));
    });
    return () => {
      socket.emit("unsubscribe", "dev-1");
      socket.disconnect();
    };
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await updateSettings({homeTitle, contactEmail});
      setHomeTitle(res.homeTitle);
      setContactEmail(res.contactEmail);
      setMsg(`Zapisano`);
    } catch (e: any) {
      setMsg(`X ${e.message}`);
    }
  };

  if (loading) return <div style={{marginTop: 20}}>Ładowanie...</div>;

  return (
    <div style={{padding: 40, display: "grid", gap: 20, maxWidth: 700}}>
      <section
        style={{border: "1px solid #ddd", padding: 20, borderRadius: 10}}
      >
        <h2>Home (public)</h2>
        <h1 style={{margin: "10px 0"}}>{homeTitle}</h1>
        <p>Kontakt: {contactEmail}</p>
        <button onClick={load}>Odśwież</button>
      </section>

      <section
        style={{border: "1px solid #ddd", padding: 20, borderRadius: 10}}
      >
        <h2>Devices (REST)</h2>
        <ul>
          {devices.map((d) => (
            <li key={d.id}>
              <b>{d.name} </b>- {d.online ? "🟢 online" : "🔴 offline"} -{" "}
              {d.lastValue}
            </li>
          ))}
        </ul>
      </section>
      <section
        style={{border: "1px solid #ddd", padding: 20, borderRadius: 10}}
      >
        <h2>CMS (admin)</h2>
        <form onSubmit={onSave} style={{display: "grid", gap: 10}}>
          <label>
            Home Title
            <input
              value={homeTitle}
              onChange={(e) => setHomeTitle(e.target.value)}
            />
          </label>
          <label>
            Contact Email
            <input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </label>
          <button type="submit">Zapisz (PUT)</button>
        </form>
        {msg && <p style={{marginTop: 10}}>{msg}</p>}
      </section>
    </div>
  );
}
