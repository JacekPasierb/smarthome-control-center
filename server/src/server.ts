import express from "express";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));



let devices = [
  {
    id: "fridge",
    name: "Czujnik temperatury - lodówka",
    online: true,
    lastValue: 4.2,
    lastSeen: Date.now(),
  },
  {
    id: "balcony",
    name: "Czujnik temperatury - balkon",
    online: true,
    lastValue: -1.3,
    lastSeen: Date.now(),
  },
  {
    id: "room",
    name: "Czujnik temperatury - pokój",
    online: true,
    lastValue: 21.5,
    lastSeen: Date.now(),
  },
];

app.get("/health", (req, res) => {
  res.json({status: "ok"});
});

app.get("/api/home/:homeId/state", (req, res) => {
  const { homeId } = req.params;
  res.json({
    homeId,
    updatedAt: Date.now(),
    sensors: {
      tempFridge: { name: "Lodówka", value: 4.2, unit: "°C", online: true, lastSeen: Date.now() },
      tempBalcony: { name: "Balkon", value: -1.3, unit: "°C", online: true, lastSeen: Date.now() },
      temp_room: { name: "Pokój", value: 21.5, unit: "°C", online: true, lastSeen: Date.now() },
      humidity_room: { name: "Wilgotność", value: 45, unit: "%", online: true, lastSeen: Date.now() },
      power_total: { name: "Pobór mocy", value: 320, unit: "W", online: true, lastSeen: Date.now() },
    },
    security: {
      door_main: { name: "Drzwi wejściowe", state: "closed", online: true, lastSeen: Date.now() },
      alarm:{armed:false,triggered:false}
    },
    alerts:[]
  })
})


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
  const idx = Math.floor(Math.random() * devices.length);
  const d = devices[idx];

  const ranges = {
    fridge: [2, 8],
    balcony: [-10, 10],
    room: [18, 25],
  };

  const [min, max] = ranges[d.id] || [0, 30];
  d.lastValue = Number((min + Math.random() * (max - min)).toFixed(1));
  d.lastSeen = Date.now();
  d.online = true;

  // io.to(d.id).emit("device-update", d);
  io.emit("device-update", d);
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
