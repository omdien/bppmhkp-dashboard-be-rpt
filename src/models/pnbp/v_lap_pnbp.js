import { DataTypes } from "sequelize";
import { db_pnbp } from "../../config/Database.js";

const V_Lap_Pnbp = db_pnbp.define(
  "v_lap_pnbp",
  {
    nomor_aju: DataTypes.STRING(50),
    kd_unit: DataTypes.STRING(10),
    nm_pendek: DataTypes.STRING(50),
    nm_pengirim: DataTypes.STRING(400),
    jenis: DataTypes.STRING(14),   
    uraian_negara: DataTypes.STRING(50),
    no_pnbp: DataTypes.STRING(50),
    tgl_pnbp: DataTypes.DATE,
    no_bill: DataTypes.STRING(20),
    kd_tarif: DataTypes.STRING(50),
    nm_tarif: DataTypes.STRING(225),
    volume: DataTypes.DOUBLE,
    satuan: DataTypes.STRING(50),
    tarif: DataTypes.DOUBLE,
    total_tarif: DataTypes.DOUBLE,
    pp: DataTypes.STRING(15),
    status: DataTypes.STRING(3)
  },
  {
    tableName: "v_lap_pnbp",
    timestamps: false,
    freezeTableName: true,
    noPrimaryKey: true
  }
);

export default V_Lap_Pnbp;
