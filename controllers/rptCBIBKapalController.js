import TbCBIBKapal from "../models/kapal/tb_cbib_kapal.js";
import { Op, fn, col, literal } from "sequelize";
import ExcelJS from "exceljs";

// ==============================
// GET /rekap-provinsi-jumlah
// ==============================
export const get_rekap_provinsi = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;

    const whereClause = {};

    // Filter tanggal terbit jika ada
    if (startDate && endDate) {
      whereClause.tgl_terbit = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const result = await TbCBIBKapal.findAll({
      attributes: [
        "nama_provinsi",
        [fn("COUNT", col("id_cbib")), "jumlah"],
      ],
      where: whereClause,
      group: ["nama_provinsi"],
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

// ==============================
// GET /report-kapal
// ==============================
export const get_report_cbib_kapal = async (req, res) => {
  try {
    const { startDate, endDate, provinsi, page = 1, limit = 10 } = req.query;

    const whereClause = {};

    // Filter tanggal terbit
    if (startDate && endDate) {
      whereClause.tgl_terbit = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Filter provinsi jika dikirim
    if (provinsi) {
      whereClause.nama_provinsi = provinsi;
      // Kalau mau pencarian fleksibel:
      // whereClause.provinsi = { [Op.like]: `%${provinsi}%` };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows, count } = await TbCBIBKapal.findAndCountAll({
      where: whereClause,
      order: [["tgl_terbit", "ASC"]],
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

// ==================================
// === Export CBIB Kapal ke Excel ===
// ==================================
export const get_report_cbib_kapal_to_excell = async (req, res) => {
  try {
    const { startDate, endDate, provinsi } = req.query;

    const whereClause = {};

    // Filter tanggal terbit
    if (startDate && endDate) {
      whereClause.tgl_terbit = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Filter provinsi jika dikirim
    if (provinsi) {
      whereClause.nama_provinsi = provinsi;
    }

    // Ambil semua data tanpa pagination
    const rows = await TbCBIBKapal.findAll({
      where: whereClause,
      order: [["tgl_terbit", "ASC"]],
    });

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("CBIB Kapal");

    // Header kolom (sesuai field model)
    worksheet.columns = [
      { header: "No", key: "no", width: 6 },
      { header: "No CBIB", key: "no_cbib", width: 15 },
      { header: "Nama Kapal", key: "nama_kapal", width: 30 },
      { header: "NIB", key: "nib", width: 20 },
      { header: "Alamat", key: "alamat", width: 40 },
      { header: "GT", key: "gt", width: 10 },
      { header: "Tipe Kapal", key: "tipe_kapal", width: 20 },
      { header: "Tgl Inspeksi", key: "tgl_inspeksi", width: 15 },
      { header: "Tgl Laporan", key: "tgl_laporan", width: 15 },
      { header: "Jenis Produk", key: "jenis_produk", width: 30 },
      { header: "Grade SCPIB", key: "grade_scpib", width: 15 },
      { header: "Tgl Terbit", key: "tgl_terbit", width: 15 },
      { header: "Tgl Kadaluarsa", key: "tgl_kadaluarsa", width: 15 },
      { header: "UPT Inspeksi", key: "upt_inspeksi", width: 30 },
      { header: "Nama Pelabuhan", key: "nama_pelabuhan", width: 30 },
      { header: "Provinsi", key: "nama_provinsi", width: 25 },
      { header: "Nama Pemilik", key: "nama_pemilik", width: 30 },
      { header: "Telepon", key: "telepon", width: 20 },
      { header: "Nahkoda Kapal", key: "nahkoda_kapal", width: 25 },
      { header: "Jumlah ABK", key: "jumlah_abk", width: 10 },
      { header: "Alat Tangkap", key: "alat_tangkap", width: 25 },
      { header: "Daerah Tangkap", key: "daerah_tangkap", width: 25 },
      { header: "No SIUP", key: "no_siup", width: 20 },
      { header: "Tgl SIUP", key: "tgl_siup", width: 15 },
      { header: "No KBLI", key: "no_kbli", width: 20 },
      { header: "No SKKP/BKP/NK", key: "no_skkp_bkp_nk", width: 25 },
      { header: "Tgl SKKP/BKP/NK", key: "tgl_skkp_bkp_nk", width: 15 },
      { header: "PJ Pusat", key: "pj_pusat", width: 25 },
    ];

    // Isi data
    rows.forEach((row, index) => {
      const dataRow = {
        no: index + 1,
      };

      worksheet.columns.forEach((col) => {
        if (col.key !== "no") {
          let val = row[col.key];
          if (val instanceof Date) {
            val = val.toISOString().split("T")[0]; // format tanggal
          }
          dataRow[col.key] = val ?? "";
        }
      });

      worksheet.addRow(dataRow);
    });

    // Set response header
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rincian_cbib_kapal_${startDate}_${endDate}.xlsx`
    );

    // Stream file ke response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error export CBIB Kapal Excel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export CBIB Kapal to Excel",
      error: error.message,
    });
  }
};

