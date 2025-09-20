import express from "express";
import {
    get_report_skp,
    get_rekap_provinsi,
    get_rekap_provinsi_to_excell,
    get_report_skp_to_excell,
} from "../controllers/rptSKPController.js";

const router = express.Router();

router.get("/get-report-skp", get_report_skp);
router.get("/get-report-skp-to-excell", get_report_skp_to_excell)
router.get("/rekap-provinsi", get_rekap_provinsi);
router.get("/rekap-provinsi-to-excell", get_rekap_provinsi_to_excell)

export default router;
