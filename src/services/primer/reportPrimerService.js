import * as reportRepository from "../../repositories/primer/reportPrimerRepository.js";
import Tb_propinsi from "../../models/primer/tb_propinsi.js";

// export const getRincianReportService = async (queryParams) => {
//     const { page = 1, limit = 10, ...filters } = queryParams;
//     const offset = (parseInt(page) - 1) * parseInt(limit);
//     const limitNumber = parseInt(limit);

//     const { totalRecords, rows } = await reportRepository.fetchReportPrimerData(filters, offset, limitNumber);

//     const propinsiList = await Tb_propinsi.findAll({ attributes: ['KODE_PROPINSI', 'URAIAN_PROPINSI'], raw: true });
//     const propinsiMap = propinsiList.reduce((acc, curr) => {
//         acc[curr.KODE_PROPINSI] = curr.URAIAN_PROPINSI;
//         return acc;
//     }, {});

//     // ... (Bagian import dan awal fungsi tetap sama)

//     const flattenedData = rows.map(item => {
//         const data = item.get({ plain: true });

//         const v_oss = data.v_oss_header || {};
//         const header = data.tb_pbumku_laporan_header || {};
//         const file = header.tb_pbumku_laporan_file || {};
//         const lampiran = data.tr_pbumku_laporan_lampiran || {}; // Perbaikan path di sini
//         const proyek = data.v_oss_proyek || {}; // Data proyek dari asosiasi baru

//         const kodeProp = data.kd_daerah ? data.kd_daerah.substring(0, 2) : null;

//         return {
//             idchecklist: data.idchecklist,
//             tgl_izin: data.tgl_izin,
//             id_izin: data.id_izin,
//             jenis_izin: data.jenis_izin,
//             kd_izin: data.kd_izin,
//             kd_daerah: data.kd_daerah,
//             nama_izin: data.nama_izin,
//             no_izin: data.no_izin,
//             nib: data.nib,
//             tgl_permohonan: data.tgl_permohonan,
//             status_checklist: data.status_checklist,
//             sts_aktif: data.sts_aktif,
//             komoditas: lampiran.komoditas || "-",
//             no_referensi: lampiran.nomor_referensi_teknis || "-",
//             uraian_propinsi: propinsiMap[kodeProp] || "Tidak Diketahui",

//             // Data Proyek            
//             kbli: proyek.kbli || "-",
//             uraian_usaha: proyek.uraian_usaha || "-",

//             // Data Perseroan
//             npwp_perseroan: v_oss.npwp_perseroan || "-",
//             nama_perseroan: v_oss.nama_perseroan || "-",
//             alamat_perseroan: v_oss.alamat_perseroan || "-",
//             rt_rw_perseroan: v_oss.rt_rw_perseroan || "-",
//             kelurahan_perseroan: v_oss.kelurahan_perseroan || "-",
//             perseroan_daerah_id: v_oss.perseroan_daerah_id || "-",
//             kode_pos_perseroan: v_oss.kode_pos_perseroan || "-",
//             nomor_telpon_perseroan: v_oss.nomor_telpon_perseroan || "-",
//             email_perusahaan: v_oss.email_perusahaan || "-",

//             // Data Hasil Penilaian
//             total_sesuai: file.total_sesuai || "0",
//             total_minor: file.total_minor || "0",
//             total_mayor: file.total_mayor || "0",
//             total_kritis: file.total_kritis || null,
//             total_hasil: file.total_hasil || null,
//             keterangan: file.keterangan || null
//         };
//     });

// // ... (Bagian return tetap sama)

//     return {
//         data: flattenedData,
//         pagination: {
//             totalRecords,
//             totalPages: Math.ceil(totalRecords / limitNumber),
//             currentPage: parseInt(page)
//         }
//     };
// };

export const getRincianReportService = async (queryParams) => {
    const { page = 1, limit = 10, ...filters } = queryParams;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitNumber = parseInt(limit);

    // Ambil data dari tabel matang
    const { totalRecords, rows } = await reportRepository.fetchReportPrimerData(filters, offset, limitNumber);

    // Data sudah rapi, tinggal kirim (atau tambahkan uraian_propinsi jika belum ada di tabel)
    const dataFinal = rows.map(item => {
        const row = item.get({ plain: true });
        return {
            ...row,
            // Jika uraian_propinsi belum sempat dimasukkan saat import, 
            // logic mapping propinsiMap tetap bisa ditaruh di sini.
        };
    });

    return {
        data: dataFinal,
        pagination: {
            totalRecords,
            totalPages: Math.ceil(totalRecords / limitNumber),
            currentPage: parseInt(page)
        }
    };
};

export const getExportRincianService = async (filters) => {
    const rows = await reportRepository.fetchAllReportPrimerData(filters);

    const propinsiList = await Tb_propinsi.findAll({ attributes: ['KODE_PROPINSI', 'URAIAN_PROPINSI'], raw: true });
    const propinsiMap = propinsiList.reduce((acc, curr) => {
        acc[curr.KODE_PROPINSI] = curr.URAIAN_PROPINSI;
        return acc;
    }, {});

    // --- KUNCI UTAMA DI SINI ---
    const uniqueMap = new Map();

    rows.forEach(item => {
        const data = item.get({ plain: true });
        const idCheck = data.idchecklist;

        // Jika idchecklist sudah pernah masuk, abaikan baris berikutnya (duplikat)
        if (!uniqueMap.has(idCheck)) {
            const v_oss = data.v_oss_header || {};
            const proyek = data.v_oss_proyek || {};
            const lampiran = data.tr_pbumku_laporan_lampiran || {};
            const header = data.tb_pbumku_laporan_header || {};
            const file = header.tb_pbumku_laporan_file || {};

            const kodeProp = data.kd_daerah ? data.kd_daerah.substring(0, 2) : null;

            uniqueMap.set(idCheck, {
                idchecklist: data.idchecklist,
                tgl_izin: data.tgl_izin,
                id_izin: data.id_izin,
                jenis_izin: data.jenis_izin,
                kd_izin: data.kd_izin,
                kd_daerah: data.kd_daerah,
                nama_izin: data.nama_izin,
                no_izin: data.no_izin,
                nib: data.nib,
                tgl_permohonan: data.tgl_permohonan,
                status_checklist: data.status_checklist,
                sts_aktif: data.sts_aktif,

                komoditas: lampiran.komoditas || "-",
                no_referensi: lampiran.nomor_referensi_teknis || "-",
                uraian_propinsi: propinsiMap[kodeProp] || "Tidak Diketahui",

                kbli: proyek.kbli || "-",
                uraian_usaha: proyek.uraian_usaha || "-",

                npwp_perseroan: v_oss.npwp_perseroan || "-",
                nama_perseroan: v_oss.nama_perseroan || "-",
                alamat_perseroan: v_oss.alamat_perseroan || "-",
                rt_rw_perseroan: v_oss.rt_rw_perseroan || "-",
                kelurahan_perseroan: v_oss.kelurahan_perseroan || "-",
                perseroan_daerah_id: v_oss.perseroan_daerah_id || "-",
                kode_pos_perseroan: v_oss.kode_pos_perseroan || "-",
                nomor_telpon_perseroan: v_oss.nomor_telpon_perseroan || "-",
                email_perusahaan: v_oss.email_perusahaan || "-",

                total_sesuai: file.total_sesuai || "0",
                total_minor: file.total_minor || "0",
                total_mayor: file.total_mayor || "0",
                total_kritis: file.total_kritis || "0",
                total_hasil: file.total_hasil || "-",
                keterangan: file.keterangan || "-"
            });
        }
    });

    // Mengubah Map kembali menjadi Array
    return Array.from(uniqueMap.values());
};