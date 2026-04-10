import * as service from "../../services/primer/reportPrimerGabunganService.js";
import { db_report_primer } from "../../config/Database.js";
import { Sequelize } from "sequelize";
import ExcelJS from "exceljs";

const getDefaultRange = () => {
    const year = new Date().getFullYear();
    return {
        start: `${year}-01-01 00:00:00`,
        end: `${year}-12-31 23:59:59`,
    };
};

export const getPivotGabungan = async (req, res) => {
    try {
        // SESUAIKAN DENGAN URL: tgl_awal dan tgl_akhir
        const { tgl_awal, tgl_akhir } = req.query;

        const { start: defStart, end: defEnd } = getDefaultRange();

        // Gunakan tgl_awal, jika kosong baru pakai default (2026)
        const start = tgl_awal ? `${tgl_awal} 00:00:00` : defStart;
        const end = tgl_akhir ? `${tgl_akhir} 23:59:59` : defEnd;

        console.log("Range Tanggal yang digunakan:", { start, end }); // Cek di terminal, harusnya muncul 2025

        const data = await service.getPivotGabunganService(start, end);
        res.status(200).json({ status: "success", data });
    } catch (error) {
        console.error("Error getPivotGabungan:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const exportPivotGabunganExcel = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { start: defStart, end: defEnd } = getDefaultRange();
        const start = startDate ? `${startDate} 00:00:00` : defStart;
        const end = endDate ? `${endDate} 23:59:59` : defEnd;

        const pivotArray = await service.getPivotGabunganService(start, end);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Pivot Gabungan");

        const daftarIzin = ["CPPIB", "CPIB", "CPOIB", "CBIB_Kapal", "CDOIB", "CBIB"];
        sheet.addRow(["Kode Provinsi", "Provinsi", ...daftarIzin, "JUMLAH"]);

        pivotArray.forEach((row) => {
            sheet.addRow([
                row.kode_propinsi,
                row.propinsi,
                ...daftarIzin.map((izin) => row[izin] || 0),
                row.JUMLAH,
            ]);
        });

        sheet.getRow(1).font = { bold: true };

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="pivot_gabungan_${Date.now()}.xlsx"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const debugCheckData = async (req, res) => {
    try {
        const { tgl_awal, tgl_akhir } = req.query; // Format: 2025-01-01

        // 1. Cek total record tanpa filter status
        const [totalRaw] = await db_report_primer.query(
            `SELECT COUNT(*) as total FROM tr_laporan_primer_export WHERE tgl_izin BETWEEN :start AND :end`,
            { replacements: { start: `${tgl_awal} 00:00:00`, end: `${tgl_akhir} 23:59:59` }, type: Sequelize.QueryTypes.SELECT }
        );

        // 2. Cek variasi isi jenis_izin dan status_checklist
        const sampleData = await db_report_primer.query(
            `SELECT kd_izin, status_checklist, sts_aktif, COUNT(*) as qty 
             FROM tr_laporan_primer_export 
             WHERE tgl_izin BETWEEN :start AND :end
             GROUP BY kd_izin, status_checklist, sts_aktif`,
            { replacements: { start: `${tgl_awal} 00:00:00`, end: `${tgl_akhir} 23:59:59` }, type: Sequelize.QueryTypes.SELECT }
        );

        res.json({
            message: "Hasil Debugging Data Primer",
            filter_tanggal: { start: `${tgl_awal} 00:00:00`, end: `${tgl_akhir} 23:59:59` },
            total_data_di_range_ini: totalRaw.total,
            distribusi_data: sampleData,
            saran: totalRaw.total == 0 ? "Data memang tidak ada di range tanggal tersebut!" : "Cek apakah status_checklist dan sts_aktif sudah sesuai dengan filter query utama."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};