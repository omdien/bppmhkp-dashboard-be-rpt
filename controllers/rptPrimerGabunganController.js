import ExcelJS from "exceljs";
import { Sequelize } from "sequelize";
import { db_mutu, db_kapal } from "../config/Database.js";
import Tb_propinsi from "../models/primer/tb_propinsi.js";

/**
 * Utility: Range tanggal default (tahun berjalan)
 */
const getDefaultRange = () => {
  const year = new Date().getFullYear();
  return {
    start: `${year}-01-01 00:00:00`,
    end: `${year}-12-31 23:59:59`,
  };
};

/**
 * Ambil rekap CBIB Kapal per provinsi
 */
export const get_rekap_provinsi = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start: defStart, end: defEnd } = getDefaultRange();
    const start = startDate ? `${startDate} 00:00:00` : defStart;
    const end = endDate ? `${endDate} 23:59:59` : defEnd;

    const results = await db_kapal.query(
      `
      SELECT 
        LPAD(kode_provinsi, 2, '0') AS kode_provinsi,
        COUNT(*) AS jumlah
      FROM tb_cbib_kapal
      WHERE tgl_terbit BETWEEN :start AND :end
      GROUP BY kode_provinsi
      `,
      {
        replacements: { start, end },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error get_rekap_provinsi:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Utility internal untuk generate Pivot Gabungan (tanpa res)
 */
const buildPivotGabungan = async (start, end) => {
  // --- 1. Ambil data OSS ---
  const queryOSS = `
    SELECT 
        LPAD(LEFT(oss.kd_daerah, 2), 2, '0') AS kode_propinsi,
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

  const ossResults = await db_mutu.query(queryOSS, {
    replacements: { start, end },
    type: Sequelize.QueryTypes.SELECT,
  });

  // --- 2. Ambil data CBIB Kapal ---
  const cbibResults = await db_kapal.query(
    `
    SELECT 
      LPAD(kode_provinsi, 2, '0') AS kode_provinsi,
      COUNT(*) AS jumlah
    FROM tb_cbib_kapal
    WHERE tgl_terbit BETWEEN :start AND :end
    GROUP BY kode_provinsi
    `,
    {
      replacements: { start, end },
      type: Sequelize.QueryTypes.SELECT,
    }
  );

  // --- 3. Master provinsi ---
  const propinsiList = await Tb_propinsi.findAll();
  const propinsiMap = {};
  propinsiList.forEach((p) => {
    const kode = p.KODE_PROPINSI.toString().padStart(2, "0");
    propinsiMap[kode] = p.URAIAN_PROPINSI.trim().toUpperCase();
  });

  // --- 4. Inisialisasi pivot ---
  const daftarIzin = ["CPPIB", "CPIB", "CPOIB", "CBIB_Kapal", "CDOIB", "CBIB"];
  const pivotMap = {};

  propinsiList.forEach((p) => {
    const kode = p.KODE_PROPINSI.toString().padStart(2, "0");
    const nama = p.URAIAN_PROPINSI.trim().toUpperCase();
    pivotMap[nama] = {
      kode_propinsi: kode,
      propinsi: nama,
      JUMLAH: 0,
    };
    daftarIzin.forEach((izin) => (pivotMap[nama][izin] = 0));
  });

  // --- 5. Tambahkan data OSS ---
  ossResults.forEach((row) => {
    const kodePropinsi = row.kode_propinsi.padStart(2, "0");
    const namaPropinsi = propinsiMap[kodePropinsi];
    if (namaPropinsi && daftarIzin.includes(row.ur_izin_singkat)) {
      pivotMap[namaPropinsi][row.ur_izin_singkat] += Number(row.jumlah || 0);
      pivotMap[namaPropinsi].JUMLAH += Number(row.jumlah || 0);
    }
  });

  // --- 6. Tambahkan CBIB Kapal ---
  cbibResults.forEach((r) => {
    const kodePropinsi = r.kode_provinsi?.toString().padStart(2, "0");
    const namaPropinsi = propinsiMap[kodePropinsi];
    if (namaPropinsi && pivotMap[namaPropinsi]) {
      pivotMap[namaPropinsi].CBIB_Kapal += Number(r.jumlah || 0);
      pivotMap[namaPropinsi].JUMLAH += Number(r.jumlah || 0);
    }
  });

  return Object.values(pivotMap).sort((a, b) => b.JUMLAH - a.JUMLAH);
};

/**
 * API: Get Pivot Gabungan
 */
export const getPivotGabungan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start: defStart, end: defEnd } = getDefaultRange();
    const start = startDate ? `${startDate} 00:00:00` : defStart;
    const end = endDate ? `${endDate} 23:59:59` : defEnd;

    const data = await buildPivotGabungan(start, end);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getPivotGabungan:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * API: Export Pivot Gabungan ke Excel
 */
export const exportPivotGabunganExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start: defStart, end: defEnd } = getDefaultRange();
    const start = startDate ? `${startDate} 00:00:00` : defStart;
    const end = endDate ? `${endDate} 23:59:59` : defEnd;

    // 🔥 Ambil langsung data pivot (tanpa fetch)
    const pivotArray = await buildPivotGabungan(start, end);

    // --- Siapkan file Excel ---
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Pivot Gabungan");

    const daftarIzin = ["CPPIB", "CPIB", "CPOIB", "CBIB_Kapal", "CDOIB", "CBIB"];
    const header = ["Kode Provinsi", "Provinsi", ...daftarIzin, "JUMLAH"];
    sheet.addRow(header);

    pivotArray.forEach((row) => {
      const data = [
        row.kode_propinsi,
        row.propinsi,
        ...daftarIzin.map((izin) => row[izin] || 0),
        row.JUMLAH,
      ];
      sheet.addRow(data);
    });

    sheet.getRow(1).font = { bold: true };
    sheet.columns.forEach((col) => (col.width = 15));

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="pivot_gabungan_${Date.now()}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Pivot Gabungan Excel:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
