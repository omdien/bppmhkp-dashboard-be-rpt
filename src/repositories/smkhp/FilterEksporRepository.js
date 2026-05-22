import Tb_r_negara from "../../models/common/tb_r_negara.js";
import Tb_r_upt from "../../models/common/tb_r_upt.js";
import Tr_report_ekspor from "../../models/ekspor/tr_report_ekspor.js";
import { Op } from "sequelize";

const FilterEksporRepository = {
    // Ambil semua negara yang pernah muncul di data ekspor (distinct)
    // getNegaraOptions: async () => {
    //     const rows = await Tr_report_ekspor.findAll({
    //         attributes: [
    //             ["kode_negara_partner", "kode"],
    //             ["negara_tujuan", "uraian"],
    //         ],
    //         where: {
    //             kode_negara_partner: { [Op.not]: null },
    //             negara_tujuan: { [Op.not]: "" },
    //         },
    //         group: ["kode_negara_partner", "negara_tujuan"],
    //         order: [["negara_tujuan", "ASC"]],
    //         raw: true,
    //     });
    //     return rows;
    // },

    getNegaraOptions: async () => {
        const rows = await Tb_r_negara.findAll({
            attributes: [
                ["KODE_NEGARA", "kode"],
                ["URAIAN_NEGARA", "uraian"],
            ],
            group: ["KODE_NEGARA", "URAIAN_NEGARA"],
            order: [["URAIAN_NEGARA", "ASC"]],
            raw: true,
        });
        return rows;
    },

    // Ambil UPT aktif dari tb_r_upt
    getUptOptions: async () => {
        const rows = await Tb_r_upt.findAll({
            attributes: [
                ["KD_UNIT", "kode"],
                ["NM_PENDEK_BARU", "uraian"],
            ],
            where: {
                STS_AKTIF: 1,
                KD_UNIT: { [Op.ne]: "98.0" },
                KD_UNIT: { [Op.ne]: "99.0" }
            },
            order: [["NM_PENDEK_BARU", "ASC"]],
            raw: true,
        });
        return rows;
    },

    // Ambil komoditas (kel_ikan) distinct dari tr_report_ekspor
    getKomoditasOptions: async () => {
        const rows = await Tr_report_ekspor.findAll({
            attributes: [["kel_ikan", "uraian"]],
            where: {
                kel_ikan: { [Op.not]: null },
                kel_ikan: { [Op.ne]: "" }
            },
            group: ["kel_ikan"],
            order: [["kel_ikan", "ASC"]],
            raw: true,
        });
        return rows;
    },
};

export default FilterEksporRepository;