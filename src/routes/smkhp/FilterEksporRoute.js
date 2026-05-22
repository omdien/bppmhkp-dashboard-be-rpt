import express from "express";
import {
  getNegaraOptions,
  getUptOptions,
  getKomoditasOptions,
} from "../../controllers/smkhp/FilterEksporController.js";

const router = express.Router();

router.get("/negara", getNegaraOptions);
router.get("/upt", getUptOptions);
router.get("/komoditas", getKomoditasOptions);

export default router;