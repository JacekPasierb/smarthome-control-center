export type Door = {
  name: string;
  state: "open" | "closed";
  online: boolean;
  lastSeen: number;
};

export type Alarm = {
  armed: boolean;
  triggered: boolean;
};

export function SecurityCard({door, alarm}: {door: Door; alarm: Alarm}) {
  return (
    <div style={{display: "grid", gap: 12}}>
      <div style={{border: "1px solid #ddd", borderRadius: 8, padding: 12}}>
        <div
          style={{display: "flex", justifyContent: "space-between", gap: 12}}
        >
          <strong>{door.name}</strong>
          <span>{door.online ? "🟢 Online" : "🔴 Offline"}</span>
        </div>

        <div style={{marginTop: 6, fontSize: 22, fontWeight: 700}}>
          {door.state === "open" ? "🚪 Open" : "🔐 Closed"}
        </div>

        <div style={{fontSize: 12, opacity: 0.7, marginTop: 6}}>
          lastSeen: {new Date(door.lastSeen).toLocaleTimeString()}
        </div>
      </div>
      <div style={{border: "1px solid #ddd", borderRadius: 8, padding: 12}}>
        <div
          style={{display: "flex", justifyContent: "space-between", gap: 12}}
        >
          <strong>Alarm</strong>
          <span>{alarm.armed ? "⚱️ Armed" : "🔴 Disarmed"}</span>
        </div>

        {alarm.triggered && (
          <div style={{marginTop: 8, color: "red", fontWeight: 700}}>
            🚨 ALERT TRIGGERED
          </div>
        )}
      </div>
    </div>
  );
}
