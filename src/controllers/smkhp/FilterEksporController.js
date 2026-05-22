import FilterEksporService from "../../services/smkhp/FilterEksporService.js";

export const getNegaraOptions = async (req, res) => {
  try {
    const data = await FilterEksporService.getNegaraOptions();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getNegaraOptions error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil data negara" });
  }
};

export const getUptOptions = async (req, res) => {
  try {
    const data = await FilterEksporService.getUptOptions();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getUptOptions error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil data UPT" });
  }
};

export const getKomoditasOptions = async (req, res) => {
  try {
    const data = await FilterEksporService.getKomoditasOptions();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getKomoditasOptions error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil data komoditas" });
  }
};