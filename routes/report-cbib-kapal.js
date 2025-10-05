import express from "express";
import {
    get_rekap_provinsi,
    get_report_cbib_kapal,
    get_report_cbib_kapal_to_excell
} from "../controllers/rptCBIBKapalController.js";

const router = express.Router();

router.get("/rekap-provinsi", get_rekap_provinsi);
router.get("/get-report-cbib-kapal",get_report_cbib_kapal);
router.get("/get-report-cbib-kapal-to-excell",get_report_cbib_kapal_to_excell)

export default router;