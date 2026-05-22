import SmkhpRepository from "../../repositories/smkhp/SmkhpRepository.js";
import Tb_r_upt from "../../models/common/tb_r_upt.js";
import ExcelJS from "exceljs";

const DATE_FIELDS = ["tanggal_aju", "tanggal_berangkat", "tanggal_smkhp"];

const formatDateTime = (date) => {
    if (!date || isNaN(new Date(date))) return "-";
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const mapRowWithDolar = (plain) => ({
    ...plain,
    nilai_dolar: (plain.nilai_rupiah || 0) / (plain.kurs_usd || 1),
});

const SmkhpService = {
    // --- Data utama (paginated) ---
    getReportPaginated: async (params) => {
        const { rows, count } = await SmkhpRepository.findPaginated(params);
        const data = rows.map((item) => mapRowWithDolar(item.get({ plain: true })));
        return {
            data,
            totalRecords: count,
            currentPage: parseInt(params.page),
            totalPages: Math.ceil(count / parseInt(params.limit)),
        };
    },

    // --- Export ke Excel ---
    exportToExcel: async (params, res) => {
        const rows = await SmkhpRepository.findAll(params);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Laporan SMKHP");

        const HEADER_ALIASES = {
            nomor_aju: "NOMOR AJU", tanggal_aju: "TGL AJU", tanggal_berangkat: "TGL BRKT",
            no_hc: "NO SMKHP", tanggal_smkhp: "TGL SMKHP", nama_upt: "UPT",
            nama_trader: "TRADER", alamat_trader: "ALAMAT TRADER", nama_upi: "UPI",
            alamat_upi: "ALAMAT UPI", nama_partner: "PARTNER", alamat_partner: "ALAMAT PARTNER",
            ket_bentuk: "BENTUK", pel_asal: "PEL ASAL", pel_muat: "PEL MUAT",
            negara_tujuan: "NEGARA", pel_bongkar: "PEL BONGKAR", hscode: "HS CODE",
            kel_ikan: "KEL IKAN", nm_dagang: "NM DAGANG", nm_latin: "NM LATIN",
            netto: "NETTO", jumlah: "JUMLAH", satuan: "SATUAN",
            nilai_rupiah: "RP", kurs_usd: "KURS", nilai_dolar: "USD",
            cara_angkut: "ANGKUT", alat_angkut: "ALAT", voyage: "VOYAGE",
        };

        const COLUMNS = [...Object.keys(HEADER_ALIASES)];

        // Header row
        const headerRow = worksheet.addRow(["#", ...COLUMNS.map((k) => HEADER_ALIASES[k])]);
        headerRow.font = { bold: true };
        headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFEFEF" } };
        headerRow.eachCell((cell) => {
            cell.border = { bottom: { style: "thin" } };
        });

        // Data rows
        rows.forEach((item, index) => {
            const plain = mapRowWithDolar(item.get({ plain: true }));
            DATE_FIELDS.forEach((f) => { plain[f] = formatDateTime(plain[f]); });

            const row = worksheet.addRow([index + 1, ...COLUMNS.map((k) => plain[k] ?? "")]);
            row.eachCell((cell) => {
                cell.border = { bottom: { style: "hair" } };
            });
        });

        // Auto column width
        worksheet.columns.forEach((col) => {
            let maxLen = 10;
            col.eachCell?.({ includeEmpty: false }, (cell) => {
                const len = String(cell.value ?? "").length;
                if (len > maxLen) maxLen = len;
            });
            col.width = Math.min(maxLen + 2, 40);
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=laporan_smkhp_${params.kdUpt}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    },

    // --- Dropdown options ---
    getNegaraOptions: async () => SmkhpRepository.findNegaraOptions(),

    getUptOptions: async () => {
        return Tb_r_upt.findAll({
            attributes: [["KD_UNIT", "kode"], ["NM_PENDEK", "uraian"]],
            where: { STS_AKTIF: 1 },
            order: [["NM_PENDEK", "ASC"]],
            raw: true,
        });
    },

    getKomoditasOptions: async () => SmkhpRepository.findKomoditasOptions(),
};

export default SmkhpService;