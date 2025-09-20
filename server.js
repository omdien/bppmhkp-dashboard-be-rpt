import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rptEksporRoute from "./routes/report-ekspor.js";
import rptPrimerRoute from "./routes/report-primer.js";
import rptSKPRoute from "./routes/report-skp.js";
import rptPNBProute from "./routes/report-pnbp.js";
import { verifyToken } from "./middleware/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware untuk parsing cookie
app.use(cookieParser());

// CORS hanya izinkan dari localhost:3001
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3001",
  credentials: true,   // ⬅️ kalau butuh kirim cookie / header auth
}));

app.use(express.json());

app.use("/api/report/ekspor", verifyToken, rptEksporRoute);
app.use("/api/report/primer", verifyToken, rptPrimerRoute);
app.use("/api/report/skp", verifyToken, rptSKPRoute);
app.use("/api/report/pnbp", verifyToken, rptPNBProute);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Dashboard service running on port ${PORT}`);
});