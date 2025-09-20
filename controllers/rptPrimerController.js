import { Sequelize } from "sequelize";
import { db_mutu } from "../config/Database.js";
import Tb_propinsi from "../models/primer/tb_propinsi.js";
import Tr_oss_checklist from "../models/primer/tr_oss_checklist.js";
import Tr_pbumku_laporan_header from "../models/primer/tr_pbumku_laporan_header.js";
import Tr_pbumku_laporan_file from "../models/primer/tr_pbumku_laporan_file.js";
import Tr_pbumku_laporan_lampiran from "../models/primer/tr_pbumku_laporan_lampiran.js";
import V_oss_header from "../models/primer/v_oss_header.js";
import ExcelJS from "exceljs";

export const getTr_oss_checklist_propinsi_izin_tabel = async (req, res) => {
  try {
    const { tgl_awal, tgl_akhir } = req.query;
    const start = tgl_awal ? `${tgl_awal} 00:00:00` : '2024-01-01 00:00:00';
    const end = tgl_akhir ? `${tgl_akhir} 23:59:59` : '2024-12-31 23:59:59';

    const query = `
      SELECT 
          LEFT(oss.kd_daerah, 2) AS kode_propinsi,
          izin.ur_izin_singkat,
          COUNT(oss.idchecklist) AS jumlah
      FROM tr_oss_checklist oss
      LEFT JOIN tb_perizinan izin ON oss.kd_izin = izin.kd_izin
      WHERE oss.sts_aktif = '1'
        AND oss.status_checklist = '50'
        AND oss.kd_izin != '032000000023'
        AND oss.tgl_izin BETWEEN :start AND :end
      GROUP BY kode_propinsi, izin.ur_izin_singkat
    `;

    const results = await db_mutu.query(query, {
      replacements: { start, end },
      type: Sequelize.QueryTypes.SELECT,
    });

    const propinsiList = await Tb_propinsi.findAll();
    const propinsiMap = {};
    propinsiList.forEach(p => {
      const kode = p.KODE_PROPINSI.toString().padStart(2, '0');
      propinsiMap[kode] = p.URAIAN_PROPINSI;
    });

    const daftarIzin = ['CPPIB', 'CPIB', 'CPOIB', 'CBIB Kapal', 'CDOIB', 'CBIB'];

    const pivotMap = {};

    results.forEach(row => {
      const kodePropinsi = row.kode_propinsi.padStart(2, '0');
      const namaPropinsi = propinsiMap[kodePropinsi] || kodePropinsi;

      if (!pivotMap[namaPropinsi]) {
        pivotMap[namaPropinsi] = {
          kode_propinsi: kodePropinsi,
          propinsi: namaPropinsi,
          JUMLAH: 0
        };

        daftarIzin.forEach(izin => {
          pivotMap[namaPropinsi][izin] = 0;
        });
      }

      if (daftarIzin.includes(row.ur_izin_singkat)) {
        pivotMap[namaPropinsi][row.ur_izin_singkat] = row.jumlah;
        pivotMap[namaPropinsi].JUMLAH += row.jumlah;
      }
    });

    const pivotArray = Object.values(pivotMap).sort((a, b) => b.JUMLAH - a.JUMLAH);

    res.status(200).json(pivotArray);
  } catch (error) {
    console.error("Error fetching OSS Checklist Pivot:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportTr_oss_checklist_propinsi_izin_excel = async (req, res) => {
  try {
    const { tgl_awal, tgl_akhir } = req.query;
    const start = tgl_awal ? `${tgl_awal} 00:00:00` : "2024-01-01 00:00:00";
    const end = tgl_akhir ? `${tgl_akhir} 23:59:59` : "2024-12-31 23:59:59";

    // Reuse query yang sama
    const query = `
      SELECT 
          LEFT(oss.kd_daerah, 2) AS kode_propinsi,
          izin.ur_izin_singkat,
          COUNT(oss.idchecklist) AS jumlah
      FROM tr_oss_checklist oss
      LEFT JOIN tb_perizinan izin ON oss.kd_izin = izin.kd_izin
      WHERE oss.sts_aktif = '1'
        AND oss.status_checklist = '50'
        AND oss.kd_izin != '032000000023'
        AND oss.tgl_izin BETWEEN :start AND :end
      GROUP BY kode_propinsi, izin.ur_izin_singkat
    `;

    const results = await db_mutu.query(query, {
      replacements: { start, end },
      type: Sequelize.QueryTypes.SELECT,
    });

    const propinsiList = await Tb_propinsi.findAll();
    const propinsiMap = {};
    propinsiList.forEach((p) => {
      const kode = p.KODE_PROPINSI.toString().padStart(2, "0");
      propinsiMap[kode] = p.URAIAN_PROPINSI;
    });

    const daftarIzin = ["CPPIB", "CPIB", "CPOIB", "CBIB Kapal", "CDOIB", "CBIB"];
    const pivotMap = {};

    results.forEach((row) => {
      const kodePropinsi = row.kode_propinsi.padStart(2, "0");
      const namaPropinsi = propinsiMap[kodePropinsi] || kodePropinsi;

      if (!pivotMap[namaPropinsi]) {
        pivotMap[namaPropinsi] = {
          kode_propinsi: kodePropinsi,
          propinsi: namaPropinsi,
          JUMLAH: 0,
        };

        daftarIzin.forEach((izin) => {
          pivotMap[namaPropinsi][izin] = 0;
        });
      }

      if (daftarIzin.includes(row.ur_izin_singkat)) {
        pivotMap[namaPropinsi][row.ur_izin_singkat] = row.jumlah;
        pivotMap[namaPropinsi].JUMLAH += row.jumlah;
      }
    });

    const pivotArray = Object.values(pivotMap).sort((a, b) => b.JUMLAH - a.JUMLAH);

    // === ExcelJS ===
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pivot Per Provinsi");

    // Header
    worksheet.addRow(["Kode Provinsi", "Nama Provinsi", ...daftarIzin, "JUMLAH"]);

    // Rows
    pivotArray.forEach((row) => {
      worksheet.addRow([
        row.kode_propinsi,
        row.propinsi,
        ...daftarIzin.map((izin) => row[izin] || 0),
        row.JUMLAH,
      ]);
    });

    // Format sederhana
    worksheet.columns.forEach((col) => {
      col.width = 20;
    });
    worksheet.getRow(1).font = { bold: true };

    // Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="pivot_propinsi_${tgl_awal || "2024-01-01"}_${tgl_akhir || "2024-12-31"}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting pivot Excel:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const get_rincian_report_primer = async (req, res) => {
  try {
    const Op = Sequelize.Op;
    const { tgl_awal, tgl_akhir, status_checklist = '50', kd_izin, kd_daerah_prefix, page = 1, limit = 10 } = req.query;

    if (!tgl_awal || !tgl_akhir) {
      return res.status(400).json({ message: "Parameter tgl_awal dan tgl_akhir diperlukan." });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const whereConditions = {
      [Op.and]: [
        { sts_aktif: "1" },
        { kd_izin: { [Op.ne]: '032000000023' } },
        { tgl_izin: { [Op.between]: [tgl_awal, tgl_akhir] } }
      ]
    };

    if (status_checklist) whereConditions[Op.and].push({ status_checklist });
    if (kd_izin) whereConditions[Op.and].push({ kd_izin });
    if (kd_daerah_prefix) whereConditions[Op.and].push({
      kd_daerah: { [Op.like]: `${kd_daerah_prefix}%` }
    });

    const propinsiList = await Tb_propinsi.findAll();
    const propinsiMap = {};
    propinsiList.forEach(p => {
      const plain = p.get({ plain: true });
      propinsiMap[plain.KODE_PROPINSI] = plain.URAIAN_PROPINSI;
    });

    const totalRecords = await Tr_oss_checklist.count({ where: whereConditions });

    const result = await Tr_oss_checklist.findAll({
      attributes: [
        "idchecklist", "tgl_izin", "id_izin", "jenis_izin", "kd_izin", "kd_daerah", "nama_izin",
        "no_izin", "nib", "tgl_permohonan", "status_checklist", "sts_aktif"
      ],
      where: whereConditions,
      offset,
      limit: limitNumber,
      include: [
        { model: Tr_pbumku_laporan_lampiran, attributes: ["komoditas"], required: false },
        { model: V_oss_header, as: 'v_oss_header', attributes: ["npwp_perseroan", "nama_perseroan", "alamat_perseroan", "rt_rw_perseroan", "kelurahan_perseroan", "perseroan_daerah_id", "kode_pos_perseroan", "nomor_telpon_perseroan", "email_perusahaan"], required: false },
        { model: Tr_pbumku_laporan_header, required: false, include: { model: Tr_pbumku_laporan_file, attributes: ["total_sesuai", "total_minor", "total_mayor", "total_kritis", "total_hasil", "keterangan"], required: false } }
      ]
    });

    const flattened = result.map(item => {
      const { v_oss_header, tb_pbumku_laporan_header, tr_pbumku_laporan_lampiran, ...checklistData } = item.get({ plain: true });
      const laporanFile = tb_pbumku_laporan_header?.tb_pbumku_laporan_file;
      const kodePropinsi = checklistData.kd_daerah?.substring(0, 2);
      const uraianPropinsi = propinsiMap[kodePropinsi] || null;

      return {
        ...checklistData,
        komoditas: tr_pbumku_laporan_lampiran?.komoditas || null,
        uraian_propinsi: uraianPropinsi,
        npwp_perseroan: v_oss_header?.npwp_perseroan || null,
        nama_perseroan: v_oss_header?.nama_perseroan || null,
        alamat_perseroan: v_oss_header?.alamat_perseroan || null,
        rt_rw_perseroan: v_oss_header?.rt_rw_perseroan || null,
        kelurahan_perseroan: v_oss_header?.kelurahan_perseroan || null,
        perseroan_daerah_id: v_oss_header?.perseroan_daerah_id || null,
        kode_pos_perseroan: v_oss_header?.kode_pos_perseroan || null,
        nomor_telpon_perseroan: v_oss_header?.nomor_telpon_perseroan || null,
        email_perusahaan: v_oss_header?.email_perusahaan || null,
        total_sesuai: laporanFile?.total_sesuai || null,
        total_minor: laporanFile?.total_minor || null,
        total_mayor: laporanFile?.total_mayor || null,
        total_kritis: laporanFile?.total_kritis || null,
        total_hasil: laporanFile?.total_hasil || null,
        keterangan: laporanFile?.keterangan || null
      };
    });

    // ✅ Sesuaikan field dengan PaginatedResponse<T>
    res.status(200).json({
      data: flattened,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limitNumber),
      currentPage: pageNumber
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const export_rincian_report_primer = async (req, res) => {
  try {
    const Op = Sequelize.Op;
    const { tgl_awal, tgl_akhir, status_checklist = '50', kd_izin, kd_daerah_prefix } = req.query;

    if (!tgl_awal || !tgl_akhir) {
      return res.status(400).json({ message: "Parameter tgl_awal dan tgl_akhir diperlukan." });
    }

    // ----- Kondisi filter -----
    const whereConditions = {
      [Op.and]: [
        { sts_aktif: "1" },
        { kd_izin: { [Op.ne]: '032000000023' } },
        { tgl_izin: { [Op.between]: [tgl_awal, tgl_akhir] } }
      ]
    };

    if (status_checklist) whereConditions[Op.and].push({ status_checklist });
    if (kd_izin) whereConditions[Op.and].push({ kd_izin });
    if (kd_daerah_prefix) whereConditions[Op.and].push({
      kd_daerah: { [Op.like]: `${kd_daerah_prefix}%` }
    });

    // ----- Map kode propinsi -----
    const propinsiList = await Tb_propinsi.findAll();
    const propinsiMap = {};
    propinsiList.forEach(p => {
      const plain = p.get({ plain: true });
      propinsiMap[plain.KODE_PROPINSI] = plain.URAIAN_PROPINSI;
    });

    // ----- Ambil semua data (tanpa pagination) -----
    const result = await Tr_oss_checklist.findAll({
      attributes: [
        "idchecklist", "tgl_izin", "id_izin", "jenis_izin", "kd_izin", "kd_daerah", "nama_izin",
        "no_izin", "nib", "tgl_permohonan", "status_checklist", "sts_aktif"
      ],
      where: whereConditions,
      include: [
        { model: Tr_pbumku_laporan_lampiran, attributes: ["komoditas"], required: false },
        { model: V_oss_header, as: 'v_oss_header', attributes: ["npwp_perseroan", "nama_perseroan", "alamat_perseroan", "rt_rw_perseroan", "kelurahan_perseroan", "perseroan_daerah_id", "kode_pos_perseroan", "nomor_telpon_perseroan", "email_perusahaan"], required: false },
        { model: Tr_pbumku_laporan_header, required: false, include: { model: Tr_pbumku_laporan_file, attributes: ["total_sesuai", "total_minor", "total_mayor", "total_kritis", "total_hasil", "keterangan"], required: false } }
      ]
    });

    // ----- Flatten hasil query -----
    const flattened = result.map(item => {
      const { v_oss_header, tb_pbumku_laporan_header, tr_pbumku_laporan_lampiran, ...checklistData } = item.get({ plain: true });
      const laporanFile = tb_pbumku_laporan_header?.tb_pbumku_laporan_file;
      const kodePropinsi = checklistData.kd_daerah?.substring(0, 2);
      const uraianPropinsi = propinsiMap[kodePropinsi] || null;

      return {
        ...checklistData,
        komoditas: tr_pbumku_laporan_lampiran?.komoditas || null,
        uraian_propinsi: uraianPropinsi,
        npwp_perseroan: v_oss_header?.npwp_perseroan || null,
        nama_perseroan: v_oss_header?.nama_perseroan || null,
        alamat_perseroan: v_oss_header?.alamat_perseroan || null,
        rt_rw_perseroan: v_oss_header?.rt_rw_perseroan || null,
        kelurahan_perseroan: v_oss_header?.kelurahan_perseroan || null,
        perseroan_daerah_id: v_oss_header?.perseroan_daerah_id || null,
        kode_pos_perseroan: v_oss_header?.kode_pos_perseroan || null,
        nomor_telpon_perseroan: v_oss_header?.nomor_telpon_perseroan || null,
        email_perusahaan: v_oss_header?.email_perusahaan || null,
        total_sesuai: laporanFile?.total_sesuai || null,
        total_minor: laporanFile?.total_minor || null,
        total_mayor: laporanFile?.total_mayor || null,
        total_kritis: laporanFile?.total_kritis || null,
        total_hasil: laporanFile?.total_hasil || null,
        keterangan: laporanFile?.keterangan || null
      };
    });

    // ----- Buat workbook Excel -----
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Rincian Primer");

    const headerRow = [
      "ID Checklist", "Tgl Izin", "ID Izin", "Jenis Izin", "Kode Izin", "Kode Daerah", "Nama Izin",
      "No Izin", "NIB", "Tgl Permohonan", "Status Checklist", "Sts Aktif",
      "Komoditas", "Provinsi", "NPWP", "Nama Perseroan", "Alamat", "RT/RW", "Kelurahan",
      "Perseroan Daerah ID", "Kode Pos", "Telpon", "Email",
      "Total Sesuai", "Total Minor", "Total Mayor", "Total Kritis", "Total Hasil", "Keterangan"
    ];
    sheet.addRow(headerRow);

    flattened.forEach((row) => {
      sheet.addRow([
        row.idchecklist, row.tgl_izin, row.id_izin, row.jenis_izin, row.kd_izin, row.kd_daerah, row.nama_izin,
        row.no_izin, row.nib, row.tgl_permohonan, row.status_checklist, row.sts_aktif,
        row.komoditas, row.uraian_propinsi, row.npwp_perseroan, row.nama_perseroan, row.alamat_perseroan, row.rt_rw_perseroan, row.kelurahan_perseroan,
        row.perseroan_daerah_id, row.kode_pos_perseroan, row.nomor_telpon_perseroan, row.email_perusahaan,
        row.total_sesuai, row.total_minor, row.total_mayor, row.total_kritis, row.total_hasil, row.keterangan
      ]);
    });

    // ----- Kirim file -----
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=Rincian_Primer.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

