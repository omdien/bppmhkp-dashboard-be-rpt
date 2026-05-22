import SmkhpService from "../../services/smkhp/SmkhpService.js";

// Helper: baca params filter dari query
const extractFilterParams = (req) => ({
    kdUpt: req.params.kdUpt,
    tglAwal: req.query.tglAwal,
    tglAkhir: req.query.tglAkhir,
    negara: req.query.negara || "",
    upt: req.query.upt || "",
    komoditas: req.query.komoditas || "",
    page: req.query.page || 1,
    limit: req.query.limit || 20,
});

// GET /smkhp/:kdUpt?page=&limit=&tglAwal=&tglAkhir=&negara=&upt=&komoditas=
export const getReportSmkhp = async (req, res) => {
    try {
        const params = extractFilterParams(req);
        const result = await SmkhpService.getReportPaginated(params);
        res.status(200).json(result);
    } catch (err) {
        console.error("getReportSmkhp error:", err);
        res.status(500).json({ message: "Gagal mengambil data SMKHP", error: err.message });
    }
};

// GET /smkhp/:kdUpt/export?tglAwal=&tglAkhir=&negara=&upt=&komoditas=
export const exportReportSmkhp = async (req, res) => {
    try {
        const params = extractFilterParams(req);
        await SmkhpService.exportToExcel(params, res);
    } catch (err) {
        console.error("exportReportSmkhp error:", err);
        res.status(500).json({ message: "Gagal export Excel", error: err.message });
    }
};

// GET /smkhp/options/negara
export const getNegaraOptions = async (req, res) => {
    try {
        const data = await SmkhpService.getNegaraOptions();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("getNegaraOptions error:", err);
        res.status(500).json({ success: false, message: "Gagal mengambil data negara" });
    }
};

// GET /smkhp/options/upt
export const getUptOptions = async (req, res) => {
    try {
        const data = await SmkhpService.getUptOptions();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("getUptOptions error:", err);
        res.status(500).json({ success: false, message: "Gagal mengambil data UPT" });
    }
};

// GET /smkhp/options/komoditas
export const getKomoditasOptions = async (req, res) => {
    try {
        const data = await SmkhpService.getKomoditasOptions();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("getKomoditasOptions error:", err);
        res.status(500).json({ success: false, message: "Gagal mengambil data komoditas" });
    }
};