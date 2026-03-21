import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req, res) => res.json({ ok: true }));

app.listen(4000, () => console.log("Server is running on port 4000"));