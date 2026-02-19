import express from "express";
import {
    get_report_pnbp_nested,
    get_report_pnbp_flat,
    get_report_pnbp_summary,
    get_report_pnbp_flat_to_excel
} from "../controllers/rptPNBPController.js";

const router = express.Router();

router.get("/report-pnbp-nested", get_report_pnbp_nested);
router.get("/report-pnbp-flat", get_report_pnbp_flat);
router.get("/report-pnbp-summary", get_report_pnbp_summary);
router.get("/report-pnbp-flat-to-excel", get_report_pnbp_flat_to_excel);

export default router;