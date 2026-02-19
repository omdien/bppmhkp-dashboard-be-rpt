import express from "express";
import { getAllReportEkspor, getAllReportEksporToExcell } from "../controllers/rptEksporController.js";

const router = express.Router();

// Route untuk mengambil semua data tr_report_ekspor
router.get("/tr-report-ekspor/:kdUpt", getAllReportEkspor);
router.get("/tr-report-ekspor-excell/:kdUpt", getAllReportEksporToExcell);

export default router;