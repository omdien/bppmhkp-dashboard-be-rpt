import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// routes
import rptEksporRoute from "./routes/report-ekspor.js";
import rptPrimerRoute from "./routes/report-primer.js";
import rptSKPRoute from "./routes/report-skp.js";
import rptPNBProute from "./routes/report-pnbp.js";
import rptCBIBKapal from "./routes/report-cbib-kapal.js";
import rptLapPNBProute from "./routes/pnbp/lapPnbpRoutes.js";

// middleware
import { verifyToken } from "./middleware/auth.js";

const app = express();

// ================= MIDDLEWARE =================

// parsing cookie
app.use(cookieParser());

// CORS config
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3001",
        credentials: true,
    })
);

app.use(express.json());

// ================= ROUTES =================

// 🔐 Private routes
app.use("/api/report/ekspor", verifyToken, rptEksporRoute);
app.use("/api/report/primer", rptPrimerRoute);
app.use("/api/report/skp", verifyToken, rptSKPRoute);
app.use("/api/report/pnbp", verifyToken, rptPNBProute);
app.use("/api/report/cbibkapal", verifyToken, rptCBIBKapal);
app.use("/api/report/lap-pnbp", rptLapPNBProute);

// 🌐 Public route
app.use("/api/report/public/primer", rptPrimerRoute);

export default app;
