import "dotenv/config";
import http from "http";
import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
