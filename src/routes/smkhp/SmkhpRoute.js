import express from "express";
import {
    getReportSmkhp,
    exportReportSmkhp,
    getNegaraOptions,
    getUptOptions,
    getKomoditasOptions,
} from "../../controllers/smkhp/SmkhpController.js";

const router = express.Router();

// Options untuk dropdown filter — letakkan SEBELUM /:kdUpt agar tidak bentrok
router.get("/options/negara", getNegaraOptions);
router.get("/options/upt", getUptOptions);
router.get("/options/komoditas", getKomoditasOptions);

// Data utama
router.get("/:kdUpt", getReportSmkhp);
router.get("/:kdUpt/export", exportReportSmkhp);

export default router;