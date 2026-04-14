import express from "express";
import { getPivotGabungan, exportPivotGabunganExcel, debugCheckData } from "../../controllers/primer/reportPrimerGabunganController.js";

const router = express.Router();

// router.get("/", getPivotGabungan);
router.get("/pivot-propinsi-izin", getPivotGabungan)
router.get("/export-propinsi-izinl", exportPivotGabunganExcel);
router.get("/debug", debugCheckData);

export default router;