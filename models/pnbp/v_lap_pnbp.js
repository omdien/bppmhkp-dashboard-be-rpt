import { DataTypes } from "sequelize";
import { db_pnbp } from "../../config/Database.js";

const V_Lap_Pnbp = db_pnbp.define(
  "v_lap_pnbp",
  {
    nomor_aju: {
      type: DataTypes.STRING(30),
        allowNull: true,
    },
    nm_pendek: {
      type: DataTypes.STRING(150),
        allowNull: true,
    },
    nm_pengirim: {
      type: DataTypes.STRING(150),
        allowNull: true,
    },
    db_ekspor: {
      type: DataTypes.STRING(20),
        allowNull: true,
    },
    uraian_negara: {
      type: DataTypes.STRING(100),
        allowNull: true,
    },
    no_pnbp: {
      type: DataTypes.STRING(40),
        allowNull: true,
    },
    tgl_pnbp: {
      type: DataTypes.DATEONLY,
        allowNull: true,
    },
    kd_tarif: {
      type: DataTypes.STRING(20),
        allowNull: true,
    },
    nm_tarif: {
      type: DataTypes.STRING(200),
        allowNull: true,
    },
    volume: {
      type: DataTypes.DOUBLE,
        allowNull: true,
    },
    satuan: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    tarif: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    total_tarif: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    pp : {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
},{
    tableName: 'v_lap_pnbp',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_cbib" },
        ]
      },
    ]
  });

export default V_Lap_Pnbp;
