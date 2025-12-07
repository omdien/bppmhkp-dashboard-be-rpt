import express from "express";
import LapPnbpController from "../../controllers/pnbp/LapPnbpController.js";
import { validateLapPnbp } from "../../validation/pnbp/LapPnbpValidation.js";
import { validateRequest } from "../../middleware/validateRequest.js";

const router = express.Router();

router.get(
  "/report/pnbp", validateLapPnbp, validateRequest,LapPnbpController.getLaporan
);

export default router;