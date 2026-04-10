import { Sequelize } from "sequelize";
import { db_report_primer, db_kapal } from "../../config/Database.js";
import ReportPrimerExport from "../../models/primer/tr_laporan_primer_export.js";
import Tb_propinsi from "../../models/primer/tb_propinsi.js";

export const fetchSummaryPrimer = async (start, end) => {
    return await db_report_primer.query(
        `SELECT 
            LEFT(kd_daerah, 2) AS kode_propinsi,
            kd_izin, 
            COUNT(*) AS jumlah
        FROM tr_laporan_primer_export
        WHERE sts_aktif = '1'
          AND status_checklist = '50'
          AND tgl_izin BETWEEN :start AND :end
        GROUP BY kode_propinsi, kd_izin`,
        {
            replacements: { start, end },
            type: Sequelize.QueryTypes.SELECT,
        }
    );
};

export const fetchSummaryKapal = async (start, end) => {
    return await db_kapal.query(
        `SELECT 
            kode_provinsi, 
            COUNT(*) AS jumlah
        FROM tb_cbib_kapal
        WHERE tgl_terbit BETWEEN :start AND :end
        GROUP BY kode_provinsi`,
        {
            replacements: { start, end },
            type: Sequelize.QueryTypes.SELECT,
        }
    );
};

export const fetchAllPropinsi = async () => {
    return await Tb_propinsi.findAll({ raw: true });
};