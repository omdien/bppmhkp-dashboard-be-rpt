// controllers/rptSKPController.js
import TbSkpPaska from "../models/skp/tb_skp_paska.js";
import { Op, fn, col, literal } from "sequelize";
import ExcelJS from "exceljs";

// ==============================
// GET /report-skp
// ==============================
export const get_report_skp = async (req, res) => {
  try {
    const { startDate, endDate, provinsi, page = 1, limit = 10 } = req.query;

    const whereClause = {};

    // Filter tanggal terbit
    if (startDate && endDate) {
      whereClause.tanggal_terbit = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Filter provinsi jika dikirim
    if (provinsi) {
      whereClause.provinsi = provinsi;
      // Kalau mau pencarian fleksibel:
      // whereClause.provinsi = { [Op.like]: `%${provinsi}%` };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows, count } = await TbSkpPaska.findAndCountAll({
      where: whereClause,
      order: [["tanggal_terbit", "ASC"]],
      limit: parseInt(limit),
      offset,
    });

    res.status(200).json({
      data: rows,
      total: rows.length, // jumlah data di halaman ini
      totalPages: Math.ceil(count / limit),
      totalRecords: count, // jumlah semua data sesuai filter
    });
  } catch (error) {
    console.error("Error get_report_skp:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report SKP",
      error: error.message,
    });
  }
};

// ==============================
// GET /report-skp-to-excel
// ==============================
export const get_report_skp_to_excell = async (req, res) => {
  try {
    const { startDate, endDate, provinsi } = req.query;

    const whereClause = {};

    // Filter tanggal terbit jika ada
    if (startDate && endDate) {
      whereClause.tanggal_terbit = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Filter provinsi jika ada
    if (provinsi) {
      whereClause.provinsi = provinsi;
    }

    // Ambil semua data sesuai filter
    const rows = await TbSkpPaska.findAll({
      where: whereClause,
      order: [["tanggal_terbit", "ASC"]],
      raw: true, // tetap raw supaya mudah diakses
    });

    // Buat workbook dan sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Report SKP");

    // Header kolom
    sheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Provinsi", key: "provinsi", width: 20 },
      { header: "Tanggal Terbit", key: "tanggal_terbit", width: 15 },
      { header: "Tanggal Kadaluarsa", key: "tanggal_kadaluarsa", width: 15 },
      { header: "Nama UPI", key: "nama_upi", width: 30 },
      { header: "NIB", key: "nib", width: 20 },
      { header: "Kota/Kabupaten", key: "kota_kabupaten", width: 25 },
      { header: "Alamat", key: "alamat", width: 40 },
      { header: "Skala Usaha", key: "skala_usaha", width: 20 },
      { header: "Jenis Permohonan", key: "jenis_permohonan", width: 20 },
      { header: "Nomor SKP", key: "nomor_skp", width: 25 },
      { header: "Nama Produk", key: "nama_produk", width: 30 },
      { header: "Jenis Olahan", key: "jenis_olahan", width: 20 },
      { header: "Peringkat", key: "peringkat", width: 10 },
    ];

    // Isi data
    rows.forEach((row, index) => {
      sheet.addRow({
        no: index + 1,
        provinsi: row.provinsi,
        tanggal_terbit: row.tanggal_terbit
          ? new Date(row.tanggal_terbit).toISOString().split("T")[0]
          : "",
        tanggal_kadaluarsa: row.tanggal_kadaluarsa
          ? new Date(row.tanggal_kadaluarsa).toISOString().split("T")[0]
          : "",
        nama_upi: row.nama_upi,
        nib: row.nib,
        kota_kabupaten: row.kota_kabupaten,
        alamat: row.alamat,
        skala_usaha: row.skala_usaha,
        jenis_permohonan: row.jenis_permohonan,
        nomor_skp: row.nomor_skp,
        nama_produk: row.nama_produk,
        jenis_olahan: row.jenis_olahan,
        peringkat: row.peringkat,
      });
    });

    // Set header response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_skp_${startDate || "all"}_${endDate || "all"}.xlsx`
    );

    // Kirim workbook ke client
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error get_report_skp_to_excell:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export report SKP to Excel",
      error: error.message,
    });
  }
};

// ==============================
// GET /rekap-provinsi-jumlah
// ==============================
export const get_rekap_provinsi = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;

    const whereClause = {};

    // Filter tanggal terbit jika ada
    if (startDate && endDate) {
      whereClause.tanggal_terbit = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const result = await TbSkpPaska.findAll({
      attributes: [
        "provinsi_id","provinsi",
        [fn("COUNT", col("id")), "jumlah"],
      ],
      where: whereClause,
      group: ["provinsi_id","provinsi"],
      order: [[literal("jumlah"), "DESC"]],
      ...(limit ? { limit: parseInt(limit, 10) } : {}),
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error get_rekap_provinsi_jumlah:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rekap provinsi jumlah",
      error: error.message,
    });
  }
};

export const get_rekap_provinsi_to_excell = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;

    const whereClause = {};

    // Filter tanggal terbit jika ada
    if (startDate && endDate) {
      whereClause.tanggal_terbit = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Ambil data rekap provinsi
    const result = await TbSkpPaska.findAll({
      attributes: ["provinsi", [fn("COUNT", col("id")), "jumlah"]],
      where: whereClause,
      group: ["provinsi"],
      order: [[literal("jumlah"), "DESC"]],
      ...(limit ? { limit: parseInt(limit, 10) } : {}),
      raw: true,
    });

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Rekap Provinsi");

    // Header
    sheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Provinsi", key: "provinsi", width: 30 },
      { header: "Jumlah SKP", key: "jumlah", width: 15 },
    ];

    // Isi data
    result.forEach((row, index) => {
      sheet.addRow({
        no: index + 1,
        provinsi: row.provinsi,
        jumlah: row.jumlah,
      });
    });

    // Set response header untuk download file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rekap_provinsi_${startDate || ""}_${endDate || ""}.xlsx`
    );

    // Kirim file ke client
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error get_rekap_provinsi_to_excell:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export rekap provinsi to Excel",
      error: error.message,
    });
  }
};
