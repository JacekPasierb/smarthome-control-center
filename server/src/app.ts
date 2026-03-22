import express from "express";
import cors from "cors";
import { homeRouter } from "./routes/home.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/home", homeRouter);

app.get("/health", (req, res) => {
  res.json({status: "ok"});
});

export default app;