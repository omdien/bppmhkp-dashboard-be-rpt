import express from "express";
import { getRincianReport,  export_rincian_report_primer } from "../../controllers/primer/reportPrimerController.js";

const router = express.Router();

/**
 * @route   GET /api/primer/report-rincian
 * @desc    Mendapatkan rincian laporan primer dengan filter tanggal, status, dan daerah
 * @access  Public (atau tambahkan middleware auth jika diperlukan)
 */
router.get("/report-rincian", getRincianReport);
router.get("/export-rincian", export_rincian_report_primer);

// Anda bisa menambahkan route lain yang berhubungan dengan laporan primer di sini
// Contoh: router.get("/report-summary", getSummaryReport);

export default router;