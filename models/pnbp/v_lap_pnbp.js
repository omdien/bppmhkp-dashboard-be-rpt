import { DataTypes } from "sequelize";
import { db_pnbp } from "../../config/Database.js";

const V_Lap_Pnbp = db_pnbp.define(
  "v_lap_pnbp",
  {
    nomor_aju: DataTypes.STRING(30),
    nm_pendek: DataTypes.STRING(150),
    nm_pengirim: DataTypes.STRING(150),
    ekspor: DataTypes.STRING(20),   
    uraian_negara: DataTypes.STRING(100),
    no_pnbp: DataTypes.STRING(40),
    tgl_pnbp: DataTypes.DATE,
    kd_tarif: DataTypes.STRING(20),
    nm_tarif: DataTypes.STRING(200),
    volume: DataTypes.DOUBLE,
    satuan: DataTypes.STRING(50),
    tarif: DataTypes.DOUBLE,
    total_tarif: DataTypes.DOUBLE,
    pp: DataTypes.STRING(20)
  },
  {
    tableName: "v_lap_pnbp",
    timestamps: false,
    freezeTableName: true,
    noPrimaryKey: true
  }
);

export default V_Lap_Pnbp;
