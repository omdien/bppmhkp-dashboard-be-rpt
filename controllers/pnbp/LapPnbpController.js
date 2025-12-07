import LapPnbpService from "../../services/pnbp/LapPnbpService.js";

class LapPnbpController {

  async getLaporan(req, res) {
    try {
      const data = await LapPnbpService.getLaporan(req.query);

      return res.status(200).json({
        success: true,
        message: "Data laporan PNBP berhasil diambil",
        data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

}

export default new LapPnbpController();
