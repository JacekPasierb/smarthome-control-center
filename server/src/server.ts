import express from "express";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));

let settings = {
  homeTitle: "Witaj w IoT",
  contactEmail: "info@domowa.pl",
};

let devices = [
  {
    id: "dev-1",
    name: "Czujnik 1",
    online: true,
    lastValue: 21.5,
    lastSeen: Date.now(),
  },
  {
    id: "dev-2",
    name: "Czujnik 2",
    online: false,
    lastValue: 0,
    lastSeen: Date.now() - 600000,
  },
];

app.get("/api/settings", (req, res) => {
  res.json(settings);
});

app.put("/api/settings", (req, res) => {
  const {homeTitle, contactEmail} = req.body || {};
  if (!homeTitle || homeTitle.length < 3) {
    return res.status(400).json({message: "homeTitle min 3 znaki"});
  }
  if (!contactEmail || !contactEmail.includes("@")) {
    return res.status(400).json({message: "contactEmail niepoprawny"});
  }
  settings = {homeTitle, contactEmail};
  res.json(settings);
});

app.get("/api/devices", (req, res) => {
  res.json(devices);
});

//login
app.post("/api/auth/login", (req, res) => {
  const {login, password} = req.body || {};
  if (login === "admin" && password === "admin123") {
    return res
      .status(400)
      .json({ok: true, user: {login: "admin", role: "admin"}});
  }
  return res.status(401).json({message: "Błedny login lub hasło"});
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {origin: "http://localhost:5173"},
});

io.on("connection", (socket) => {
  console.log("Nowe połączenie:", socket.id);

  socket.on("subscribe", (deviceId) => {
    console.log(`Socket ${socket.id} subscribed to ${deviceId}`);
    socket.join(deviceId);
  });

  socket.on("unsubscribe", (deviceId) => {
    socket.leave(deviceId);
  });
});

// symulacja IoT - co 5 sekund zmienia stan urządzenia
setInterval(() => {
  devices[0].lastValue = Number((20 + Math.random() * 5).toFixed(2));
  devices[0].lastSeen = Date.now();
  devices[0].online = true;
  io.emit("device-update", devices[0]);
  io.to(devices[0].id).emit("device-update", devices[0]);
}, 5000);

setInterval(() => {
  const now = Date.now();

  devices.forEach((device) => {
    if (now - device.lastSeen > 10000) {
      device.online = false;
      io.to(device.id).emit("device-update", device);
    }
  });
}, 3000);

server.listen(4000, () => console.log("Server działa na 4000"));
