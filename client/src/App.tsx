import {useEffect, useState} from "react";
import {ping} from "./services/api";

export default function App() {
  const [data, setData] = useState<{ok: boolean} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ping()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div style={{padding: 20}}>
      <h1>React + Node</h1>

      {error && <p>{error}</p>}
      {data && <p>Backend mówi: ok = {String(data.ok)}</p>}
      {!error && !data && <p>Ładowanie...</p>}
    </div>
  );
}
