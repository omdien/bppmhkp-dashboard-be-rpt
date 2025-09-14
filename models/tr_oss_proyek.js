import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Tb_skala_usaha_skp from "./tb_skala_usaha_skp.js";


const { DataTypes } = Sequelize;

const Tr_oss_proyek = db.define(
  "tr_oss_proyek",
  {
    idpryk: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    nib: {
      type: DataTypes.STRING(13),
      allowNull: false,
      defaultValue: ""
    },
    id_proyek: {
      type: DataTypes.STRING(23),
      allowNull: false,
      defaultValue: ""
    },
    nomor_proyek: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: ""
    },
    uraian_usaha: {
      type: DataTypes.STRING(155),
      allowNull: false,
      defaultValue: ""
    },
    jumlah_tki_l: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0"
    },
    jumlah_tki_p: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0"
    },
    jumlah_tka_l: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0"
    },
    jumlah_tka_p: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0"
    },
    kbli: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: ""
    },
    sektor: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: ""
    },
    memiliki_menguasai: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: ""
    },
    jenis_lokasi: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: ""
    },
    status_tanah: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: ""
    },
    luas_tanah: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    satuan_luas_tanah: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: ""
    },
    pembelian_pematang_tanah: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    bangunan_gedung: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    mesin_peralatan: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    mesin_peralatan_usd: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    investasi_lain: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    sub_jumlah: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    modal_kerja: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    jumlah_investasi: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    tanggal_kurs: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nilai_kurs: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    kd_kawasan: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: "0"
    },
    flag_perluasan: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: ""
    },
    flag_cabang: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: ""
    },
    npwp_cabang: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: ""
    },
    nama_cabang: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: ""
    },
    jenis_identitas_pj: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: ""
    },
    no_identitas_pj: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: ""
    },
    nama_pj: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ""
    },
    status_proyek: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: ""
    },
    jenis_proyek: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: ""
    },
    nama_kegiatan: {
      type: DataTypes.STRING(115),
      allowNull: false,
      defaultValue: ""
    },
    flag_merger: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: ""
    },
    npwp_perseroan_merger: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: ""
    },
    nama_perseroan_merger: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: ""
    },
    skala_usaha: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: ""
    },
    skala_resiko: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: ""
    },
    deskripsi_kegiatan: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    flag_satu_lini: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: ""
    },
    tgl_insert: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sts_aktif: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: ""
    }
  }, {
  Sequelize,
  tableName: 'tr_oss_proyek',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "idpryk" },
      ]
    },
  ]
});

Tr_oss_proyek.belongsTo(Tb_skala_usaha_skp, {
  foreignKey: 'skala_usaha',
  targetKey: 'kode_skala',
  as: 'skalaInfo'
});

export default Tr_oss_proyek;