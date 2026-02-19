import { Sequelize } from "sequelize";
import db_mutu from "../../config/Database.js";

const { DataTypes } = Sequelize;

const Tr_pbumku_spt = db_mutu.define(
  "tr_pbumku_spt",
  {
    idspt: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idoss: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idpryk: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idchecklist: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nib: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    nomor_spt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tanggal_spt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    kd_upt: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    kbli: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    nama_izin: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pejabat_ttd: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jabtan_ttd: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    Sequelize,
    tableName: 'tr_pbumku_spt',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idspt" },
        ]
      },
    ]
  });

export default Tr_pbumku_spt;
