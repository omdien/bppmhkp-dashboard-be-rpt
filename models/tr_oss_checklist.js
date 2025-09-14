import { Sequelize } from "sequelize";
import { db_mutu } from "../config/Database.js";
import Tb_propinsi from "./tb_propinsi.js";
import V_oss_header from "./v_oss_header.js";
import Tr_pbumku_laporan_header from "./tr_pbumku_laporan_header.js";
import Tr_pbumku_laporan_lampiran from "./tr_pbumku_laporan_lampiran.js";
import Tr_pbumku_laporan_file from "./tr_pbumku_laporan_file.js";

const { DataTypes } = Sequelize;

const Tr_oss_checklist = db_mutu.define(
  "tr_oss_checklist",
  {
    idchecklist: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    kd_daerah: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "" },
    kd_izin: { type: DataTypes.STRING(12), allowNull: false, defaultValue: "" },
    tgl_izin: { type: DataTypes.STRING(10), allowNull: true },
    nama_izin: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "" },
    no_izin: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "" },
    nib: { type: DataTypes.STRING(13), allowNull: false, defaultValue: "" },
    status_checklist: { type: DataTypes.STRING(2), allowNull: false, defaultValue: "0" },
    sts_aktif: { type: DataTypes.STRING(1), allowNull: false, defaultValue: "" },
    tgl_permohonan: { type: DataTypes.STRING(20), allowNull: true },
  },
  { tableName: "tr_oss_checklist", timestamps: false }
);

// Relasi dengan propinsi
Tr_oss_checklist.belongsTo(Tb_propinsi, {
  foreignKey: "kd_daerah",
  targetKey: "KODE_PROPINSI",
});

// Relasi dengan header OSS
Tr_oss_checklist.belongsTo(V_oss_header, {
  foreignKey: "nib",
  targetKey: "nib",
  as: "v_oss_header",
});

// Relasi dengan laporan lampiran (komoditas)
Tr_oss_checklist.belongsTo(Tr_pbumku_laporan_lampiran, {
  foreignKey: "idchecklist",
  targetKey: "idchecklist",
});

// Relasi dengan laporan header
Tr_oss_checklist.belongsTo(Tr_pbumku_laporan_header, {
  foreignKey: "idchecklist",
  targetKey: "idchecklist",
});

export default Tr_oss_checklist;
