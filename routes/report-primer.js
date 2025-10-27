import express from "express";
import {
    getTr_oss_checklist_propinsi_izin_tabel,
    get_rincian_report_primer,
    export_rincian_report_primer,
    // exportTr_oss_checklist_propinsi_izin_excel
} from "../controllers/rptPrimerController.js";

import {
    getPivotGabungan,
    exportPivotGabunganExcel
} from "../controllers/rptPrimerGabunganController.js"

const router = express.Router();

router.get("/propinsi-izin", getTr_oss_checklist_propinsi_izin_tabel);
// router.get("/export-propinsi-izin", exportTr_oss_checklist_propinsi_izin_excel);
router.get("/export-propinsi-izin", exportPivotGabunganExcel);
router.get("/rincian-report", get_rincian_report_primer);
router.get("/export-rincian-report", export_rincian_report_primer);
router.get("/pivot-propinsi-izin", getPivotGabungan)

export default router;
