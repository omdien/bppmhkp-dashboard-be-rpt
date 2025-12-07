import V_Lap_Pnbp from "../../models/pnbp/v_lap_pnbp.js";
import { Op } from "sequelize";

class LapPnbpRepository {

  async getFiltered(filters) {
    const where = {};

    if (filters.startDate && filters.endDate) {
      where.tgl_pnbp = {
        [Op.between]: [filters.startDate, filters.endDate]
      };
    }

    if (filters.negara) {
      where.uraian_negara = filters.negara;
    }

    if (filters.kd_tarif) {
      where.kd_tarif = filters.kd_tarif;
    }

    return await V_Lap_Pnbp.findAll({
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
      where
    });
  }

}

export default new LapPnbpRepository();