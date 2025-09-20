import { Payment, BillHeader, BillDetail } from "../models/pnbp/associations.js";
import { db_pnbp, db_hc } from "../config/Database.js";
import ExcelJS from "exceljs";

const DB_HC_NAME = process.env.DB_NAME_HC;

export const get_report_pnbp_nested = async (req, res) => {
  try {
    const results = await Payment.findAll({
      attributes: [
        "id_trx_svr_header",
        "no_bill",
        "ntpn",
        "date_payment",
        "date_pembukuan",
        "bank_id"
      ],
      include: [
        {
          model: BillHeader,
          as: "billHeader",
          attributes: [
            "date_bill",
            "date_bill_exp",
            "kd_satker",
            "nm_wjb_byr",
            "kd_satker_pemungut",
            "npwp"
          ],
          include: [
            {
              model: BillDetail,
              as: "billDetails",
              attributes: [
                "nomor_aju",
                "nomor_pnbp",
                "kd_tarif",
                "pp",
                "kd_akun",
                "nominal",
                "volume",
                "satuan",
                "kd_lokasi",
                "kd_kabkota"
              ]
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Error get_report_pnbp:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data PNBP",
      error: error.message
    });
  }
};

export const get_report_pnbp_flat = async (req, res) => {
  try {
    let { filterType, startDate, endDate, idUPT, page = 1, limit = 10 } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const offset = (page - 1) * limit;

    if (startDate) startDate = `${startDate} 00:00:00`;
    if (endDate) endDate = `${endDate} 23:59:59`;

    let whereClauses = [];
    let replacements = {};

    if (filterType === "datePayment") {
      whereClauses.push("a.date_payment BETWEEN :startDate AND :endDate");
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    } else if (filterType === "dateBook") {
      whereClauses.push("a.date_pembukuan BETWEEN :startDate AND :endDate");
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    }

    if (idUPT && !["00.1", "00.2", "00.3"].includes(idUPT)) {
      whereClauses.push("b.kd_upt = :idUPT");
      replacements.idUPT = idUPT;
    }

    const whereSQL = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

    // Hitung total
    const [[{ totalRecords }]] = await db_pnbp.query(
      `
      SELECT COUNT(*) as totalRecords
      FROM t_payment a
      LEFT JOIN t_create_bill_header b ON a.id_trx_svr_header = b.id_trx_svr
      LEFT JOIN t_create_bill_detail c ON b.id_trx_upt = c.id_trx_upt
      LEFT JOIN tb_bank d ON a.bank_id = d.bank_id
      LEFT JOIN ${DB_HC_NAME}.tb_r_upt e ON b.kd_upt = e.KD_UNIT
      ${whereSQL}
      `,
      { replacements }
    );

    // Ambil data
    const [results] = await db_pnbp.query(
      `
      SELECT 
        a.id_trx_svr_header,
        a.no_bill,
        a.ntpn,
        a.date_payment,
        a.date_pembukuan,
        a.bank_id,
        d.bank_name,
        b.date_bill,
        b.date_bill_exp,
        b.kd_satker,
        b.nm_wjb_byr,
        b.kd_satker_pemungut,
        b.npwp,
        b.kd_upt,
        e.NM_UNIT,
        c.nomor_aju,
        c.nomor_pnbp,
        c.kd_tarif,
        c.pp,
        c.kd_akun,
        c.nominal,
        c.volume,
        c.satuan,
        c.kd_lokasi,
        c.kd_kabkota
      FROM t_payment a
      LEFT JOIN t_create_bill_header b ON a.id_trx_svr_header = b.id_trx_svr
      LEFT JOIN t_create_bill_detail c ON b.id_trx_upt = c.id_trx_upt
      LEFT JOIN tb_bank d ON a.bank_id = d.bank_id
      LEFT JOIN ${DB_HC_NAME}.tb_r_upt e ON b.kd_upt = e.KD_UNIT
      ${whereSQL}
      ORDER BY a.date_payment DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      { replacements }
    );

    res.status(200).json({
      success: true,
      data: results,
      total: results.length,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (error) {
    console.error("Error get_report_pnbp_flat:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data PNBP",
      error: error.message,
    });
  }
};

// controllers/pnbpController.js
export const get_report_pnbp_summary = async (req, res) => {
  try {
    let { filterType, startDate, endDate, idUPT } = req.query;

    // ✅ Tambah jam agar range full 1 hari
    if (startDate) startDate = `${startDate} 00:00:00`;
    if (endDate) endDate = `${endDate} 23:59:59`;

    // Build kondisi WHERE
    let whereClauses = [];
    let replacements = {};

    // Filter tanggal
    if (filterType === "datePayment") {
      whereClauses.push("a.date_payment BETWEEN :startDate AND :endDate");
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    } else if (filterType === "dateBook") {
      whereClauses.push("a.date_pembukuan BETWEEN :startDate AND :endDate");
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    }

    // Filter UPT
    if (idUPT && !["00.1", "00.2", "00.3"].includes(idUPT)) {
      whereClauses.push("b.kd_upt = :idUPT");
      replacements.idUPT = idUPT;
    }

    const whereSQL =
      whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    // 🔹 Query Summary Agregat
    const [[summary]] = await db_pnbp.query(
      `
      SELECT 
        COUNT(DISTINCT a.no_bill) AS totalBill,
        COUNT(DISTINCT a.ntpn) AS totalNTPN,
        SUM(c.nominal) AS totalNominal,
        COUNT(DISTINCT c.nomor_aju) AS totalNomorAju
      FROM t_payment a
      LEFT OUTER JOIN t_create_bill_header b 
        ON a.id_trx_svr_header = b.id_trx_svr
      LEFT OUTER JOIN t_create_bill_detail c 
        ON b.id_trx_upt = c.id_trx_upt
      ${whereSQL}
      `,
      { replacements }
    );

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Error get_report_pnbp_summary:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil summary PNBP",
      error: error.message,
    });
  }
};

// ============================================
// GET PNBP FLAT EXPORT TO EXCEL
// ============================================
export const get_report_pnbp_flat_to_excel = async (req, res) => {
  try {
    let { filterType, startDate, endDate, idUPT } = req.query;

    if (startDate) startDate = `${startDate} 00:00:00`;
    if (endDate) endDate = `${endDate} 23:59:59`;

    let whereClauses = [];
    let replacements = {};

    // Filter tanggal
    if (filterType === "datePayment") {
      whereClauses.push("a.date_payment BETWEEN :startDate AND :endDate");
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    } else if (filterType === "dateBook") {
      whereClauses.push("a.date_pembukuan BETWEEN :startDate AND :endDate");
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    }

    // Filter UPT
    if (idUPT && !["00.1", "00.2", "00.3"].includes(idUPT)) {
      whereClauses.push("b.kd_upt = :idUPT");
      replacements.idUPT = idUPT;
    }

    const whereSQL = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

    // 🔹 Ambil semua data (tanpa limit-offset)
    const [results] = await db_pnbp.query(
      `
      SELECT 
        a.id_trx_svr_header,
        a.no_bill,
        a.ntpn,
        a.date_payment,
        a.date_pembukuan,
        a.bank_id,
        d.bank_name,
        b.date_bill,
        b.date_bill_exp,
        b.kd_satker,
        b.nm_wjb_byr,
        b.kd_satker_pemungut,
        b.npwp,
        b.kd_upt,
        e.NM_UNIT,
        c.nomor_aju,
        c.nomor_pnbp,
        c.kd_tarif,
        c.pp,
        c.kd_akun,
        c.nominal,
        c.volume,
        c.satuan,
        c.kd_lokasi,
        c.kd_kabkota
      FROM t_payment a
      LEFT JOIN t_create_bill_header b ON a.id_trx_svr_header = b.id_trx_svr
      LEFT JOIN t_create_bill_detail c ON b.id_trx_upt = c.id_trx_upt
      LEFT JOIN tb_bank d ON a.bank_id = d.bank_id
      LEFT JOIN ${DB_HC_NAME}.tb_r_upt e ON b.kd_upt = e.KD_UNIT
      ${whereSQL}
      ORDER BY a.date_payment DESC
      `,
      { replacements }
    );

    // 🔹 Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report PNBP");

    // Header kolom
    worksheet.columns = [
      // { header: "ID Header", key: "id_trx_svr_header", width: 15 },
      { header: "No Bill", key: "no_bill", width: 20 },
      { header: "NTPN", key: "ntpn", width: 25 },
      { header: "Tanggal Bayar", key: "date_payment", width: 20 },
      { header: "Tanggal Buku", key: "date_pembukuan", width: 20 },
      { header: "Nomor Aju", key: "nomor_aju", width: 20 },
      { header: "Nomor PNBP", key: "nomor_pnbp", width: 20 },
      { header: "Bank", key: "bank_name", width: 25 },
      { header: "Satker", key: "kd_satker", width: 15 },
      { header: "Nama Unit", key: "NM_UNIT", width: 30 },
      { header: "Nama Wajib Bayar", key: "nm_wjb_byr", width: 40 },
      { header: "Nominal", key: "nominal", width: 20 },
      { header: "Volume", key: "volume", width: 10 },
      { header: "Satuan", key: "satuan", width: 15 },
    ];

    // Isi data
    results.forEach((row) => {
      worksheet.addRow(row);
    });

    // 🔹 Kirim response Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=report_pnbp.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error get_report_pnbp_flat_to_excel:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat export Excel",
      error: error.message,
    });
  }
};