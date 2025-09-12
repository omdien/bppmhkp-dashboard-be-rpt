import Tr_report_ekspor from "../models/tr_report_ekspor.js";
import { Sequelize } from "sequelize";
import ExcelJS from "exceljs";

const Op = Sequelize.Op;

// Utility: Format Date Time
const formatDateTime = (date) => {
    if (!date || isNaN(new Date(date))) return "-";
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// =======================
// Controller Functions
// =======================

export const getAllReportEkspor = async (req, res) => {
    const { kdUpt } = req.params;
    const { page = 1, limit = 20, tglAwal, tglAkhir } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const perPage = parseInt(limit);

    try {
        const uptSemua = ["00.1", "00.2", "00.3", "00.4"];

        let whereClause = {};
        if (!uptSemua.includes(kdUpt)) {
            whereClause.kode_upt = { [Op.like]: `%${kdUpt}%` };
        }

        if (tglAwal && tglAkhir) {
            const start = new Date(tglAwal);
            start.setHours(0, 0, 0, 0);
            const end = new Date(tglAkhir);
            end.setHours(23, 59, 59, 999);

            whereClause.tanggal_smkhp = { [Op.between]: [start, end] };
        }

        const { rows, count } = await Tr_report_ekspor.findAndCountAll({
            attributes: [
                "nomor_aju",
                "tanggal_aju",
                "tanggal_berangkat",
                "no_hc",
                "tanggal_smkhp",
                "nama_upt",
                "nama_trader",
                "alamat_trader",
                "nama_upi",
                "alamat_upi",
                "nama_partner",
                "alamat_partner",
                "ket_bentuk",
                "pel_asal",
                "pel_muat",
                "negara_tujuan",
                "pel_bongkar",
                "hscode",
                "kel_ikan",
                "nm_dagang",
                "nm_latin",
                "netto",
                "jumlah",
                "satuan",
                "nilai_rupiah",
                "kurs_usd",
                "cara_angkut",
                "alat_angkut",
                "voyage",
            ],
            where: whereClause,
            offset,
            limit: perPage,
        });

        const result = rows.map((item) => {
            const plain = item.get({ plain: true });
            plain.nilai_dolar = (plain.nilai_rupiah || 0) / (plain.kurs_usd || 1);
            return plain;
        });

        res.status(200).json({
            data: result,
            totalRecords: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / perPage),
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Gagal mengambil data", error });
    }
};

export const getAllReportEksporToExcell = async (req, res) => {
    const { kdUpt } = req.params;
    const { tglAwal, tglAkhir } = req.query;
    const dateFields = ["tanggal_aju", "tanggal_berangkat", "tanggal_smkhp"];

    try {
        const uptSemua = ["00.1", "00.2", "00.3", "00.4"];
        let whereClause = {};
        if (!uptSemua.includes(kdUpt)) {
            whereClause.kode_upt = { [Op.like]: `%${kdUpt}%` };
        }

        if (tglAwal && tglAkhir) {
            const start = new Date(tglAwal);
            start.setHours(0, 0, 0, 0);
            const end = new Date(tglAkhir);
            end.setHours(23, 59, 59, 999);

            whereClause.tanggal_smkhp = { [Op.between]: [start, end] };
        }

        const rows = await Tr_report_ekspor.findAll({
            attributes: [
                "nomor_aju",
                "tanggal_aju",
                "tanggal_berangkat",
                "no_hc",
                "tanggal_smkhp",
                "nama_upt",
                "nama_trader",
                "alamat_trader",
                "nama_upi",
                "alamat_upi",
                "nama_partner",
                "alamat_partner",
                "ket_bentuk",
                "pel_asal",
                "pel_muat",
                "negara_tujuan",
                "pel_bongkar",
                "hscode",
                "kel_ikan",
                "nm_dagang",
                "nm_latin",
                "netto",
                "jumlah",
                "satuan",
                "nilai_rupiah",
                "kurs_usd",
                "cara_angkut",
                "alat_angkut",
                "voyage",
            ],
            where: whereClause,
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report Ekspor");

        const headerAliases = {
            nomor_aju: "NOMOR AJU",
            tanggal_aju: "TGL AJU",
            tanggal_berangkat: "TGL BRKT",
            no_hc: "NO SMKHP",
            tanggal_smkhp: "TGL SMKHP",
            nama_upt: "UPT",
            nama_trader: "TRADER",
            alamat_trader: "ALAMAT TRADER",
            nama_upi: "UPI",
            alamat_upi: "ALAMAT UPI",
            nama_partner: "PARTNER",
            alamat_partner: "ALAMAT PARTNER",
            ket_bentuk: "BENTUK",
            pel_asal: "PEL ASAL",
            pel_muat: "PEL MUAT",
            negara_tujuan: "NEGARA",
            pel_bongkar: "PEL BONGKAR",
            hscode: "HS CODE",
            kel_ikan: "KEL IKAN",
            nm_dagang: "NM DAGANG",
            nm_latin: "NM LATIN",
            netto: "NETTO",
            jumlah: "JUMLAH",
            satuan: "SATUAN",
            nilai_rupiah: "RP",
            kurs_usd: "KURS",
            nilai_dolar: "USD",
            cara_angkut: "ANGKUT",
            alat_angkut: "ALAT",
            voyage: "VOYAGE",
        };

        const sample = rows[0]?.get({ plain: true });
        const headers = sample ? Object.keys(sample).concat("nilai_dolar") : [];
        const displayHeaders = headers.map(
            (key) => headerAliases[key] || key.toUpperCase()
        );

        worksheet.addRow(["#", ...displayHeaders]);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };

        rows.forEach((item, index) => {
            const plain = item.get({ plain: true });
            plain.nilai_dolar = (plain.nilai_rupiah || 0) / (plain.kurs_usd || 1);

            headers.forEach((key) => {
                if (dateFields.includes(key)) {
                    plain[key] = formatDateTime(plain[key]);
                }
            });

            const values = headers.map((key) => plain[key]);
            worksheet.addRow([index + 1, ...values]);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=report_ekspor.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Gagal ekspor Excel:", error);
        res.status(500).json({ message: "Gagal ekspor Excel", error });
    }
};

export const getAllReportEksporNormal = async (req, res) => {
    const { tgl_awal, tgl_akhir, nomor_aju } = req.query;
    const { kdUpt } = req.params;

    let whereClause = {
        kode_upt: { [Op.like]: `%${kdUpt}%` },
    };

    if (nomor_aju) {
        whereClause.nomor_aju = { [Op.like]: `%${nomor_aju}%` };
    }

    if (tgl_awal && tgl_akhir) {
        const start = new Date(tgl_awal);
        start.setHours(0, 0, 0, 0);
        const end = new Date(tgl_akhir);
        end.setHours(23, 59, 59, 999);

        whereClause.tanggal_aju = { [Op.between]: [start, end] };
    }

    try {
        const data = await Tr_report_ekspor.findAll({
            attributes: [
                "nomor_aju",
                "tanggal_aju",
                "tanggal_berangkat",
                "no_hc",
                "tanggal_smkhp",
                "nama_upt",
                "nama_trader",
                "alamat_trader",
                "nama_upi",
                "alamat_upi",
                "nama_partner",
                "alamat_partner",
                "ket_bentuk",
                "pel_asal",
                "pel_muat",
                "negara_tujuan",
                "pel_bongkar",
                "hscode",
                "kel_ikan",
                "nm_dagang",
                "nm_latin",
                "netto",
                "jumlah",
                "satuan",
                "nilai_rupiah",
                "kurs_usd",
                "cara_angkut",
                "alat_angkut",
                "voyage",
            ],
            where: whereClause,
            order: [["tanggal_aju", "DESC"]],
        });

        const grouped = {};

        data.forEach((item) => {
            const row = item.get({ plain: true });

            if (!grouped[row.nomor_aju]) {
                grouped[row.nomor_aju] = {
                    nomor_aju: row.nomor_aju,
                    tanggal_aju: row.tanggal_aju,
                    tanggal_berangkat: row.tanggal_berangkat,
                    no_hc: row.no_hc,
                    tanggal_smkhp: row.tanggal_smkhp,
                    nama_upt: row.nama_upt,
                    nama_trader: row.nama_trader,
                    alamat_trader: row.alamat_trader,
                    nama_upi: row.nama_upi,
                    alamat_upi: row.alamat_upi,
                    nama_partner: row.nama_partner,
                    alamat_partner: row.alamat_partner,
                    ket_bentuk: row.ket_bentuk,
                    pel_asal: row.pel_asal,
                    pel_muat: row.pel_muat,
                    negara_tujuan: row.negara_tujuan,
                    pel_bongkar: row.pel_bongkar,
                    cara_angkut: row.cara_angkut,
                    alat_angkut: row.alat_angkut,
                    voyage: row.voyage,
                    detail: [],
                };
            }

            grouped[row.nomor_aju].detail.push({
                hscode: row.hscode,
                kel_ikan: row.kel_ikan,
                nm_dagang: row.nm_dagang,
                nm_latin: row.nm_latin,
                netto: row.netto,
                jumlah: row.jumlah,
                satuan: row.satuan,
                nilai_rupiah: row.nilai_rupiah,
                kurs_usd: row.kurs_usd,
                nilai_dolar: (row.nilai_rupiah || 0) / (row.kurs_usd || 1),
            });
        });

        const result = Object.values(grouped);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Gagal mengambil data", error });
    }
};

export const exportReportEksporToExcel = async (req, res) => {
    const { tgl_awal, tgl_akhir } = req.query;
    const { kdUpt } = req.params;

    let whereClause = {
        kode_upt: { [Op.like]: `%${kdUpt}%` },
    };

    if (tgl_awal && tgl_akhir) {
        const start = new Date(tgl_awal);
        start.setHours(0, 0, 0, 0);
        const end = new Date(tgl_akhir);
        end.setHours(23, 59, 59, 999);

        whereClause.tanggal_aju = { [Op.between]: [start, end] };
    }

    try {
        const data = await Tr_report_ekspor.findAll({
            where: whereClause,
            order: [["tanggal_aju", "DESC"]],
        });

        const grouped = {};
        data.forEach((row) => {
            const plain = row.get({ plain: true });

            if (!grouped[plain.nomor_aju]) {
                grouped[plain.nomor_aju] = {
                    nomor_aju: plain.nomor_aju,
                    tanggal_aju: plain.tanggal_aju,
                    tanggal_berangkat: plain.tanggal_berangkat,
                    no_hc: plain.no_hc,
                    tanggal_smkhp: plain.tanggal_smkhp,
                    nama_upt: plain.nama_upt,
                    nama_trader: plain.nama_trader,
                    alamat_trader: plain.alamat_trader,
                    nama_upi: plain.nama_upi,
                    alamat_upi: plain.alamat_upi,
                    nama_partner: plain.nama_partner,
                    alamat_partner: plain.alamat_partner,
                    ket_bentuk: plain.ket_bentuk,
                    pel_asal: plain.pel_asal,
                    pel_muat: plain.pel_muat,
                    negara_tujuan: plain.negara_tujuan,
                    pel_bongkar: plain.pel_bongkar,
                    cara_angkut: plain.cara_angkut,
                    alat_angkut: plain.alat_angkut,
                    voyage: plain.voyage,
                    detail: [],
                };
            }

            grouped[plain.nomor_aju].detail.push({
                hscode: plain.hscode,
                kel_ikan: plain.kel_ikan,
                nm_dagang: plain.nm_dagang,
                nm_latin: plain.nm_latin,
                netto: plain.netto,
                jumlah: plain.jumlah,
                satuan: plain.satuan,
                nilai_rupiah: plain.nilai_rupiah,
                kurs_usd: plain.kurs_usd,
                nilai_dolar: (plain.nilai_rupiah || 0) / (plain.kurs_usd || 1),
            });
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Laporan Ekspor");

        const headerStyle = {
            font: { bold: true },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFEFEF" } },
        };

        const detailHeader = [
            "HS Code",
            "Kelompok Ikan",
            "Nama Dagang",
            "Nama Latin",
            "Netto",
            "Jumlah",
            "Satuan",
            "Nilai Rupiah",
            "Kurs USD",
            "Nilai Dolar",
        ];

        let currentRow = 1;

        for (const nomor_aju in grouped) {
            const entry = grouped[nomor_aju];

            const infoRows = [
                [
                    "Nomor Aju",
                    entry.nomor_aju,
                    "Tanggal Aju",
                    entry.tanggal_aju,
                    "Tanggal Berangkat",
                    entry.tanggal_berangkat,
                ],
                ["No HC", entry.no_hc, "Tanggal SMKHP", entry.tanggal_smkhp],
                ["Nama UPT", entry.nama_upt, "Nama Trader", entry.nama_trader],
                ["Alamat Trader", entry.alamat_trader],
                ["Nama UPI", entry.nama_upi, "Alamat UPI", entry.alamat_upi],
                ["Nama Partner", entry.nama_partner, "Alamat Partner", entry.alamat_partner],
                [
                    "Ket Bentuk",
                    entry.ket_bentuk,
                    "Pel Asal",
                    entry.pel_asal,
                    "Pel Muat",
                    entry.pel_muat,
                ],
                ["Negara Tujuan", entry.negara_tujuan, "Pel Bongkar", entry.pel_bongkar],
                [
                    "Cara Angkut",
                    entry.cara_angkut,
                    "Alat Angkut",
                    entry.alat_angkut,
                    "Voyage",
                    entry.voyage,
                ],
            ];

            infoRows.forEach((row) => {
                const newRow = worksheet.addRow(row);
                newRow.eachCell((cell, colNumber) => {
                    if (colNumber % 2 === 1) {
                        cell.font = { bold: true };
                    }
                });
                currentRow++;
            });

            worksheet.addRow([]);
            currentRow++;

            const headerRow = worksheet.addRow(detailHeader);
            headerRow.eachCell((cell) => {
                cell.style = headerStyle;
                cell.border = {
                    bottom: { style: "thin" },
                };
            });
            currentRow++;

            entry.detail.forEach((d) => {
                const row = worksheet.addRow([
                    d.hscode,
                    d.kel_ikan,
                    d.nm_dagang,
                    d.nm_latin,
                    d.netto,
                    d.jumlah,
                    d.satuan,
                    d.nilai_rupiah,
                    d.kurs_usd,
                    d.nilai_dolar,
                ]);
                row.eachCell((cell) => {
                    cell.border = { bottom: { style: "hair" } };
                });
                currentRow++;
            });

            worksheet.addRow([]);
            currentRow++;
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=laporan_ekspor.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Gagal ekspor Excel:", error);
        res.status(500).json({ message: "Gagal ekspor Excel", error });
    }
};
