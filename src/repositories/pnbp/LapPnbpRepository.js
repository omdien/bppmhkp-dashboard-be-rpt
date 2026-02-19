import V_Lap_Pnbp from "../../models/pnbp/v_lap_pnbp.js";
import { Op } from "sequelize";

class LapPnbpRepository {

  async getFiltered(filters, page, limit) {
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

    const offset = (page - 1) * limit;

    const { rows, count } = await V_Lap_Pnbp.findAndCountAll({
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
      limit,
      offset,
      order: [["nomor_aju", "ASC"]],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

}

export default new LapPnbpRepository();
