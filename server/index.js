// server/index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // configure origin as needed in production
app.use(morgan("dev"));

// connect DB
connectDB().then(() => console.log("✅ MongoDB connected (server)")).catch((e) => {
  console.error("MongoDB connection error:", e);
  process.exit(1);
});

// routes
import studentsRouter from "./routes/students.js";
import roomsRouter from "./routes/rooms.js";
import allocationRouter from "./routes/allocation.js";
import reportsRouter from "./routes/reports.js";

app.use("/api/students", studentsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/allocations", allocationRouter);
app.use("/api/reports", reportsRouter);

// simple health
app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date() }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
