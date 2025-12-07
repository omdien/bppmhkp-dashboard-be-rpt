import LapPnbpRepository from "../../repositories/pnbp/LapPnbpRepository.js";
import V_Lap_Pnbp from "../../models/pnbp/v_lap_pnbp.js";
import { Op } from "sequelize";

class LapPnbpService {
  async getLaporan(query) {
    const filters = {
      startDate: query.startDate || null,
      endDate: query.endDate || null,
      negara: query.negara || null,
      kd_tarif: query.kd_tarif || null,
    };

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;

    return await LapPnbpRepository.getFiltered(filters, page, limit);
  }

  /**
   * SERVICE UNTUK EXPORT TO EXCEL
   * Mengambil SEMUA data sekaligus tanpa pagination
   */
  async getLaporanForExport(query) {
    const where = {};

    if (query.startDate && query.endDate) {
      where.tgl_pnbp = {
        [Op.between]: [query.startDate, query.endDate],
      };
    }

    if (query.negara) {
      where.uraian_negara = query.negara;
    }

    if (query.kd_tarif) {
      where.kd_tarif = query.kd_tarif;
    }

    // AMBIL SELURUH DATA
    const rows = await V_Lap_Pnbp.findAll({
      attributes: [
        "nomor_aju",
        "nm_pendek",
        "nm_pengirim",
        "ekspor",
        "uraian_negara",
        "no_pnbp",
        "tgl_pnbp",
        "kd_tarif",
        "nm_tarif",
        "volume",
        "satuan",
        "tarif",
        "total_tarif",
        "pp"
      ],
      where,
      order: [["nomor_aju", "ASC"]],
    });

    return rows;
  }
}

export default new LapPnbpService();
