import { Sequelize } from "sequelize";
import { db_pnbp } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const T_create_bill_detail = db_pnbp.define("t_create_bill_detail",
  {
    id_trx_dtl: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_trx_upt: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    seri: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nomor_aju: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nomor_pnbp: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nm_wjb_byr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kd_tarif: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    pp: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    kd_akun: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    nominal: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    volume: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    satuan: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nominal_per_rec: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    kd_lokasi: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    kd_kabkota: {
      type: DataTypes.STRING(3),
      allowNull: true
    }
  }, {
  Sequelize,
  tableName: 't_create_bill_detail',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "id_trx_dtl" },
        { name: "id_trx_upt" },
      ]
    },
  ]
});

export default T_create_bill_detail;
