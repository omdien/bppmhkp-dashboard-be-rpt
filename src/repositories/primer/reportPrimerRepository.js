import { Sequelize } from "sequelize";
import Tr_oss_checklist from "../../models/primer/tr_oss_checklist.js";
import V_oss_header from "../../models/primer/v_oss_header.js";
import Tr_pbumku_laporan_header from "../../models/primer/tr_pbumku_laporan_header.js";
import Tr_pbumku_laporan_file from "../../models/primer/tr_pbumku_laporan_file.js";
import Tr_pbumku_laporan_lampiran from "../../models/primer/tr_pbumku_laporan_lampiran.js";
import Tr_oss_proyek from "../../models/primer/tr_oss_proyek.js"; // Import Proyek

import ReportPrimer from "../../models/primer/tr_laporan_primer_export.js"; // Model yang merujuk ke tr_laporan_primer_export

// export const fetchReportPrimerData = async (filters, offset, limit) => {
//     const Op = Sequelize.Op;
//     const whereConditions = {
//         [Op.and]: [
//             { sts_aktif: "1" },
//             { kd_izin: { [Op.ne]: '032000000023' } },
//             { tgl_izin: { [Op.between]: [filters.tgl_awal, filters.tgl_akhir] } }
//         ]
//     };

//     if (filters.status_checklist) whereConditions[Op.and].push({ status_checklist: filters.status_checklist });
//     if (filters.kd_izin) whereConditions[Op.and].push({ kd_izin: filters.kd_izin });
//     if (filters.kd_daerah_prefix) {
//         whereConditions[Op.and].push({ kd_daerah: { [Op.like]: `${filters.kd_daerah_prefix}%` } });
//     }

//     const [totalRecords, rows] = await Promise.all([
//         Tr_oss_checklist.count({ where: whereConditions }),
//         Tr_oss_checklist.findAll({
//             where: whereConditions,
//             attributes: [
//                 "idchecklist", "tgl_izin", "id_izin", "jenis_izin", "kd_izin", "kd_daerah",
//                 "nama_izin", "no_izin", "nib", "tgl_permohonan", "status_checklist", "sts_aktif","id_proyek"
//             ],
//             offset,
//             limit,
//             include: [
//                 { model: V_oss_header, as: 'v_oss_header', required: false },
//                 { 
//                     model: Tr_oss_proyek, 
//                     as: 'v_oss_proyek', 
//                     attributes: ["kbli", "uraian_usaha"], // Tarik kolom yang diminta
//                     required: false 
//                 },
//                 { 
//                     model: Tr_pbumku_laporan_lampiran, 
//                     as: 'tr_pbumku_laporan_lampiran', // Pindah ke sini (Sejajar)
//                     required: false 
//                 },
//                 {
//                     model: Tr_pbumku_laporan_header,
//                     as: 'tb_pbumku_laporan_header',
//                     required: false,
//                     include: [
//                         { model: Tr_pbumku_laporan_file, as: 'tb_pbumku_laporan_file', required: false }
//                     ]
//                 }
//             ],
//             order: [['tgl_izin', 'ASC']]
//         })
//     ]);
//     return { totalRecords, rows };
// };

// export const fetchReportPrimerData = async (filters, offset, limit) => {
//     const Op = Sequelize.Op;

//     // Kondisi dasar tetap sama sesuai permintaan Bapak
//     const whereConditions = {
//         [Op.and]: [
//             { sts_aktif: "1" },
//             { kd_izin: { [Op.ne]: '032000000023' } },
//             { tgl_izin: { [Op.between]: [filters.tgl_awal, filters.tgl_akhir] } }
//         ]
//     };

//     // Filter opsional tetap diakomodir
//     if (filters.status_checklist) whereConditions[Op.and].push({ status_checklist: filters.status_checklist });
//     if (filters.kd_izin) whereConditions[Op.and].push({ kd_izin: filters.kd_izin });
//     if (filters.kd_daerah_prefix) {
//         whereConditions[Op.and].push({ kd_daerah: { [Op.like]: `${filters.kd_daerah_prefix}%` } });
//     }

//     // Query jauh lebih sederhana, TIDAK ADA INCLUDE lagi
//     const { count: totalRecords, rows } = await ReportPrimer.findAndCountAll({
//         where: whereConditions,
//         offset,
//         limit,
//         order: [['tgl_izin', 'ASC']]
//     });

//     return { totalRecords, rows };
// };

export const fetchReportPrimerData = async (filters, offset, limit) => {
    const Op = Sequelize.Op;

    // Destructure hanya yang dibutuhkan — abaikan parameter lain
    const { tgl_awal, tgl_akhir, status_checklist, kd_izin, kd_daerah_prefix } = filters;

    const whereConditions = {
        [Op.and]: [
            { sts_aktif: "1" },
            { kd_izin: { [Op.ne]: '032000000023' } },
            { tgl_izin: { [Op.between]: [tgl_awal, tgl_akhir] } }
        ]
    };

    if (status_checklist) whereConditions[Op.and].push({ status_checklist });
    if (kd_izin) whereConditions[Op.and].push({ kd_izin });
    if (kd_daerah_prefix) {
        whereConditions[Op.and].push({ kd_daerah: { [Op.like]: `${kd_daerah_prefix}%` } });
    }

    const totalRecords = await ReportPrimer.count({ where: whereConditions });
    const rows = await ReportPrimer.findAll({
        where: whereConditions,
        offset,
        limit,
        order: [['tgl_izin', 'ASC']]
    });

    return { totalRecords, rows };
};

export const fetchAllReportPrimerData = async (filters) => {
    const Op = Sequelize.Op;
    const whereConditions = {
        [Op.and]: [
            { sts_aktif: "1" },
            { kd_izin: { [Op.ne]: '032000000023' } },
            { tgl_izin: { [Op.between]: [filters.tgl_awal, filters.tgl_akhir] } }
        ]
    };

    if (filters.status_checklist) whereConditions[Op.and].push({ status_checklist: filters.status_checklist });
    if (filters.kd_izin) whereConditions[Op.and].push({ kd_izin: filters.kd_izin });
    if (filters.kd_daerah_prefix) {
        whereConditions[Op.and].push({ kd_daerah: { [Op.like]: `${filters.kd_daerah_prefix}%` } });
    }

    return await Tr_oss_checklist.findAll({
        where: whereConditions,
        attributes: [
            "idchecklist", "tgl_izin", "id_izin", "jenis_izin", "kd_izin", "kd_daerah",
            "nama_izin", "no_izin", "nib", "tgl_permohonan", "status_checklist", "sts_aktif", "id_proyek"
        ],
        include: [
            { model: V_oss_header, as: 'v_oss_header', required: false },
            { model: Tr_oss_proyek, as: 'v_oss_proyek', attributes: ["kbli", "uraian_usaha"], required: false },
            { model: Tr_pbumku_laporan_lampiran, as: 'tr_pbumku_laporan_lampiran', required: false },
            {
                model: Tr_pbumku_laporan_header,
                as: 'tb_pbumku_laporan_header',
                required: false,
                include: [{ model: Tr_pbumku_laporan_file, as: 'tb_pbumku_laporan_file', required: false }]
            }
        ],
        order: [['tgl_izin', 'ASC']]
    });
};