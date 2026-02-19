import express from "express";
import LapPnbpController from "../../controllers/pnbp/LapPnbpController.js";
import { validateLapPnbp } from "../../validation/pnbp/lapPnbpValidation.js";
import { validateRequest } from "../../middleware/validateRequest.js";

const router = express.Router();

// GET /lap-pnbp/laporan-pnbp (paginated)
router.get(
  "/laporan-pnbp",
  validateLapPnbp,
  validateRequest,
  LapPnbpController.getLaporan
);

// NEW: GET /lap-pnbp/export-excel
router.get(
  "/export-excel",
  validateLapPnbp,
  validateRequest,
  LapPnbpController.exportExcel
);

export default router;