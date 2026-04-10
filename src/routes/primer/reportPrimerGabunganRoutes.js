import express from "express";
import { getPivotGabungan, exportPivotGabunganExcel,debugCheckData } from "../../controllers/primer/reportPrimerGabunganController.js";

const router = express.Router();

// router.get("/", getPivotGabungan);
router.get("/pivot-propinsi-izin", getPivotGabungan)
router.get("/debug", debugCheckData);
router.get("/export", exportPivotGabunganExcel);

export default router;