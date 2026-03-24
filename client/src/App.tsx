import {io} from "socket.io-client";
import {useEffect, useState} from "react";
import {SensorCard, type Sensor} from "./components/SensorCard";
import {SecurityCard, type Alarm, type Door} from "./components/SecurityCard";
import {AlertsFeed, type Alert} from "./components/AlertsFeed";

const API_URL = import.meta.env.VITE_API_URL as string;
const WS_URL = (import.meta.env.VITE_WS_URL as string) || API_URL;

interface HomeState {
  homeId: string;
  updatedAt: number;
  sensors: Record<string, Sensor>;
  security: {
    door_main: Door;
    alarm: Alarm;
  };
  alerts: Alert[];
}

export default function App() {
  const [home, setHome] = useState<HomeState | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/home/123/state`)
      .then((res) => res.json())
      .then((data) => setHome(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const socket = io(WS_URL);
    socket.emit("subscribe:home", "123");
    socket.on("home:update", (data: HomeState) => {
      setHome(data);
      setAlerts(data.alerts ?? []);
    });
    socket.on("alert:new", (alert: Alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!home) return <div style={{padding: 24}}>Loading...</div>;

  return (
    <div style={{padding: 24, fontFamily: "system-ui"}}>
      <h1 style={{marginBottom: 8}}>SmartHome Control Center</h1>
      <h2 style={{marginTop: 24}}>Sensors</h2>
      <div style={{display: "grid", gap: 12}}>
        {Object.entries(home.sensors).map(([key, sensor]) => (
          <SensorCard key={key} sensor={sensor} />
        ))}
      </div>
      <h2 style={{marginTop: 32}}>Security</h2>
      <SecurityCard
        door={home.security.door_main}
        alarm={home.security.alarm}
      />
      <h2 style={{marginTop: 32}}>Alerts</h2>
      <AlertsFeed alerts={alerts} />
    </div>
  );
}
