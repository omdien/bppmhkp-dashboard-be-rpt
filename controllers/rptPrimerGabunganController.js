import { get_rekap_provinsi } from "./rptCBIBKapalController.js";
import { db_mutu } from "../config/Database.js";
import { Sequelize } from "sequelize";
import Tb_propinsi from "../models/primer/tb_propinsi.js";

export const getPivotGabungan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // --- 1. Range tanggal ---
    const start = startDate ? `${startDate} 00:00:00` : "2024-01-01 00:00:00";
    const end = endDate ? `${endDate} 23:59:59` : "2024-12-31 23:59:59";

    // --- 2. Ambil data OSS checklist ---
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

    // --- 3. Ambil data CBIB Kapal ---
    const cbibResults = await new Promise((resolve) => {
      get_rekap_provinsi(
        { query: { startDate, endDate } },
        {
          status: () => ({
            json: (d) => resolve(d),
          }),
        }
      );
    });

    const cbibData = Array.isArray(cbibResults)
      ? cbibResults
      : cbibResults?.data || [];

    // --- 4. Ambil daftar provinsi master ---
    const propinsiList = await Tb_propinsi.findAll();
    const propinsiMap = {};
    propinsiList.forEach((p) => {
      const kode = p.KODE_PROPINSI.toString().padStart(2, "0");
      propinsiMap[kode] = p.URAIAN_PROPINSI.trim().toUpperCase();
    });

    // --- 5. Bentuk pivot awal dari master provinsi ---
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

    // --- 6. Masukkan data OSS ---
    ossResults.forEach((row) => {
      const kodePropinsi = row.kode_propinsi.padStart(2, "0");
      const namaPropinsi = propinsiMap[kodePropinsi] || kodePropinsi;

      if (daftarIzin.includes(row.ur_izin_singkat)) {
        pivotMap[namaPropinsi][row.ur_izin_singkat] += row.jumlah;
        pivotMap[namaPropinsi].JUMLAH += row.jumlah;
      }
    });

    // --- 7. Tambahkan data CBIB Kapal ---
    cbibData.forEach((r) => {
      const namaPropinsi = r.nama_provinsi?.trim().toUpperCase();
      if (pivotMap[namaPropinsi]) {
        pivotMap[namaPropinsi].CBIB_Kapal += r.jumlah;
        pivotMap[namaPropinsi].JUMLAH += r.jumlah;
      }
    });

    // --- 8. Sort hasil ---
    const pivotArray = Object.values(pivotMap).sort(
      (a, b) => b.JUMLAH - a.JUMLAH
    );

    res.status(200).json(pivotArray);
  } catch (error) {
    console.error("Error fetching Pivot Gabungan:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
