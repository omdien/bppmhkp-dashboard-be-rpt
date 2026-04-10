import * as reportService from "../../services/primer/reportPrimerService.js";
import ExcelJS from "exceljs";

// export const getRincianReport = async (req, res) => {
//     try {
//         const { tgl_awal, tgl_akhir } = req.query;

//         if (!tgl_awal || !tgl_akhir) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Periode tanggal (tgl_awal & tgl_akhir) wajib diisi."
//             });
//         }

//         const result = await reportService.getRincianReportService(req.query);

//         return res.status(200).json({
//             status: "success",
//             ...result
//         });

//     } catch (error) {
//         console.error("REPORT_CONTROLLER_ERROR:", error);

//         // Spesifik handling jika View error (Error 1356)
//         if (error.parent?.errno === 1356) {
//             return res.status(500).json({
//                 message: "Database View Error: Silakan periksa definer atau struktur view v_oss_header."
//             });
//         }

//         return res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
//     }
// };

export const getRincianReport = async (req, res) => {
    try {
        const { tgl_awal, tgl_akhir } = req.query;

        if (!tgl_awal || !tgl_akhir) {
            return res.status(400).json({
                status: "error",
                message: "Periode tanggal (tgl_awal & tgl_akhir) wajib diisi."
            });
        }

        const result = await reportService.getRincianReportService(req.query);

        return res.status(200).json({
            status: "success",
            ...result // Akan mengirimkan { data, pagination }
        });

    } catch (error) {
        console.error("REPORT_CONTROLLER_ERROR:", error);
        // Error handling tetap sama
        return res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

export const export_rincian_report_primer = async (req, res) => {
    try {
        const { tgl_awal, tgl_akhir } = req.query;

        if (!tgl_awal || !tgl_akhir) {
            return res.status(400).json({ message: "Range tanggal harus diisi." });
        }

        const dataFlattened = await reportService.getExportRincianService(req.query);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Rincian Laporan Primer");

        // --- DEFINISI HEADER LENGKAP ---
        const headers = [
            { header: "ID Checklist", key: "idchecklist", width: 12 },
            { header: "Tgl Izin", key: "tgl_izin", width: 12 },
            { header: "ID Izin", key: "id_izin", width: 10 },
            { header: "Jenis Izin", key: "jenis_izin", width: 15 },
            { header: "Kd Izin", key: "kd_izin", width: 10 },
            { header: "Kd Daerah", key: "kd_daerah", width: 10 },
            { header: "Nama Izin", key: "nama_izin", width: 35 },
            { header: "No Izin", key: "no_izin", width: 25 },
            { header: "NIB", key: "nib", width: 15 },
            { header: "Tgl Permohonan", key: "tgl_permohonan", width: 15 },
            { header: "Status Checklist", key: "status_checklist", width: 15 },
            { header: "Sts Aktif", key: "sts_aktif", width: 10 },
            { header: "Komoditas", key: "komoditas", width: 25 },
            { header: "No Ref Teknis", key: "no_referensi", width: 20 },
            { header: "Provinsi", key: "uraian_propinsi", width: 20 },

            // Data Proyek
            { header: "KBLI", key: "kbli", width: 10 },
            { header: "Uraian Usaha", key: "uraian_usaha", width: 40 },

            // Data Perseroan
            { header: "NPWP Perseroan", key: "npwp_perseroan", width: 20 },
            { header: "Nama Perseroan", key: "nama_perseroan", width: 30 },
            { header: "Alamat Perseroan", key: "alamat_perseroan", width: 40 },
            { header: "RT/RW", key: "rt_rw_perseroan", width: 10 },
            { header: "Kelurahan", key: "kelurahan_perseroan", width: 20 },
            { header: "ID Daerah Perseroan", key: "perseroan_daerah_id", width: 15 },
            { header: "Kode Pos", key: "kode_pos_perseroan", width: 10 },
            { header: "Telp Perseroan", key: "nomor_telpon_perseroan", width: 15 },
            { header: "Email Perusahaan", key: "email_perusahaan", width: 25 },

            // Hasil Penilaian
            { header: "Sesuai", key: "total_sesuai", width: 10 },
            { header: "Minor", key: "total_minor", width: 10 },
            { header: "Mayor", key: "total_mayor", width: 10 },
            { header: "Kritis", key: "total_kritis", width: 10 },
            { header: "Total Hasil", key: "total_hasil", width: 12 },
            { header: "Keterangan", key: "keterangan", width: 40 }
        ];

        sheet.columns = headers;

        // 2. Styling Header
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2F75B5' }
        };
        sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // 3. Masukkan Data (Looping dataFlattened)
        dataFlattened.forEach((row) => {
            sheet.addRow({
                idchecklist: row.idchecklist,
                tgl_izin: row.tgl_izin,
                id_izin: row.id_izin,
                jenis_izin: row.jenis_izin,
                kd_izin: row.kd_izin,
                kd_daerah: row.kd_daerah,
                nama_izin: row.nama_izin,
                no_izin: row.no_izin,
                nib: row.nib,
                tgl_permohonan: row.tgl_permohonan,
                status_checklist: row.status_checklist,
                sts_aktif: row.sts_aktif,
                komoditas: row.komoditas,
                no_referensi: row.no_referensi,
                uraian_propinsi: row.uraian_propinsi,
                kbli: row.kbli,
                uraian_usaha: row.uraian_usaha,
                npwp_perseroan: row.npwp_perseroan,
                nama_perseroan: row.nama_perseroan,
                alamat_perseroan: row.alamat_perseroan,
                rt_rw_perseroan: row.rt_rw_perseroan,
                kelurahan_perseroan: row.kelurahan_perseroan,
                perseroan_daerah_id: row.perseroan_daerah_id,
                kode_pos_perseroan: row.kode_pos_perseroan,
                nomor_telpon_perseroan: row.nomor_telpon_perseroan,
                email_perusahaan: row.email_perusahaan,
                total_sesuai: row.total_sesuai,
                total_minor: row.total_minor,
                total_mayor: row.total_mayor,
                total_kritis: row.total_kritis,
                total_hasil: row.total_hasil,
                keterangan: row.keterangan
            });
        });

        // 4. Styling: Border & Font
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle' };
            });
        });

        // 5. Freeze Header (Agar header tetap terlihat saat scroll down)
        sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

        // 6. Kirim File
        const fileName = `Rincian_Report_Primer_${tgl_awal}_sd_${tgl_akhir}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Gagal export Excel rincian lengkap" });
    }
};