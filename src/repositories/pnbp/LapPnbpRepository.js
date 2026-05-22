import V_Lap_Pnbp from "../../models/pnbp/v_lap_pnbp.js";
import { Op } from "sequelize";

const UPT_SEMUA = ["00.1", "00.2", "00.3", "00.4"];

const ATTRIBUTES = [
  "nomor_aju",
  "kd_unit",
  "nm_pendek",
  "nm_pengirim",
  "jenis",
  "uraian_negara",
  "no_pnbp",
  "tgl_pnbp",
  "no_bill",
  "kd_tarif",
  "nm_tarif",
  "volume",
  "satuan",
  "tarif",
  "total_tarif",
  "pp",
  "status",
];

class LapPnbpRepository {

  async getFiltered(filters, page, limit) {
    const where = {};

    // ✅ Filter UPT — ditambahkan, konsisten dengan kolom "kd_unit"
    if (filters.kdUpt && !UPT_SEMUA.includes(filters.kdUpt)) {
      where.kd_unit = { [Op.like]: `%${filters.kdUpt}%` };
    }

    if (filters.startDate && filters.endDate) {
      where.tgl_pnbp = {
        [Op.between]: [
          `${filters.startDate} 00:00:00`,
          `${filters.endDate} 23:59:59`
        ]
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
      attributes: ATTRIBUTES,
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

  // ✅ Export dipindahkan ke repository agar konsisten & tidak duplikasi logic
  async getAllForExport(filters) {
    const where = {};

    if (filters.kdUpt && !UPT_SEMUA.includes(filters.kdUpt)) {
      where.kd_unit = { [Op.like]: `%${filters.kdUpt}%` };
    }

    if (filters.startDate && filters.endDate) {
      where.tgl_pnbp = {
        [Op.between]: [
          `${filters.startDate} 00:00:00`,
          `${filters.endDate} 23:59:59`
        ]
      };
    }

    if (filters.negara) {
      where.uraian_negara = filters.negara;
    }

    if (filters.kd_tarif) {
      where.kd_tarif = filters.kd_tarif;
    }

    return await V_Lap_Pnbp.findAll({
      attributes: ATTRIBUTES,
      where,
      order: [["nomor_aju", "ASC"]],
    });
  }
}

export default new LapPnbpRepository();