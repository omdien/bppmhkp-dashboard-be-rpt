import Tr_report_ekspor from "../../models/ekspor/tr_report_ekspor.js";
import { Sequelize } from "sequelize";

const { Op } = Sequelize;

const UPT_SEMUA = ["00.1", "00.2", "00.3", "00.4"];

// Utility: bangun whereClause berdasarkan params umum
const buildWhereClause = ({ kdUpt, tglAwal, tglAkhir, negara, upt, komoditas }) => {
    const where = {};

    // Filter UPT
    if (!UPT_SEMUA.includes(kdUpt)) {
        where.kode_upt = { [Op.like]: `%${kdUpt}%` };
    }

    // Override kode_upt jika filter UPT spesifik dipilih
    if (upt) {
        where.kode_upt = { [Op.like]: `%${upt}%` };
    }

    // Filter rentang tanggal SMKHP
    if (tglAwal && tglAkhir) {
        const start = new Date(tglAwal);
        start.setHours(0, 0, 0, 0);
        const end = new Date(tglAkhir);
        end.setHours(23, 59, 59, 999);
        where.tanggal_smkhp = { [Op.between]: [start, end] };
    }

    // Filter negara tujuan
    if (negara) {
        // where.kode_negara_partner = negara;
        where.negara_tujuan = negara;
    }

    // Filter komoditas (kel_ikan)
    if (komoditas) {
        where.kel_ikan = komoditas;
    }

    return where;
};

// Kolom yang diambil untuk list & export
const REPORT_ATTRIBUTES = [
    "nomor_aju", "tanggal_aju", "tanggal_berangkat", "no_hc", "tanggal_smkhp",
    "nama_upt", "nama_trader", "alamat_trader", "nama_upi", "alamat_upi",
    "nama_partner", "alamat_partner", "ket_bentuk", "pel_asal", "pel_muat",
    "negara_tujuan", "pel_bongkar", "hscode", "kel_ikan", "nm_dagang", "nm_latin",
    "netto", "jumlah", "satuan", "nilai_rupiah", "kurs_usd",
    "cara_angkut", "alat_angkut", "voyage",
];

const SmkhpRepository = {
    // Paginated list dengan filter
    findPaginated: async ({ kdUpt, tglAwal, tglAkhir, negara, upt, komoditas, page, limit }) => {
        const where = buildWhereClause({ kdUpt, tglAwal, tglAkhir, negara, upt, komoditas });
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { rows, count } = await Tr_report_ekspor.findAndCountAll({
            attributes: REPORT_ATTRIBUTES,
            where,
            offset,
            limit: parseInt(limit),
            order: [["tanggal_smkhp", "DESC"]],
        });

        return { rows, count };
    },

    // Semua data untuk export Excel (tanpa pagination)
    findAll: async ({ kdUpt, tglAwal, tglAkhir, negara, upt, komoditas }) => {
        const where = buildWhereClause({ kdUpt, tglAwal, tglAkhir, negara, upt, komoditas });

        return Tr_report_ekspor.findAll({
            attributes: REPORT_ATTRIBUTES,
            where,
            order: [["tanggal_smkhp", "DESC"]],
        });
    },

    // Distinct options untuk dropdown filter negara
    findNegaraOptions: async () => {
        return Tr_report_ekspor.findAll({
            attributes: [
                [Sequelize.fn("DISTINCT", Sequelize.col("kode_negara_partner")), "kode"],
                ["negara_tujuan", "uraian"],
            ],
            where: {
                kode_negara_partner: { [Op.not]: null },
                negara_tujuan: { [Op.not]: "" },
            },
            group: ["kode_negara_partner"],   // ← group by kode saja, bukan + uraian
            order: [["negara_tujuan", "ASC"]],
            raw: true,
        });
    },
    // Distinct options untuk dropdown filter komoditas
    findKomoditasOptions: async () => {
        return Tr_report_ekspor.findAll({
            attributes: [
                [Sequelize.fn("DISTINCT", Sequelize.col("kel_ikan")), "kode"],
                ["kel_ikan", "uraian"],
            ],
            where: { kel_ikan: { [Op.not]: null } },
            group: ["kel_ikan"],
            order: [["kel_ikan", "ASC"]],
            raw: true,
        });
    },
};

export default SmkhpRepository;