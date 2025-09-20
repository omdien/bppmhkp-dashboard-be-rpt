import { Sequelize } from "sequelize";
import { db_pnbp } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const T_create_bill_header = db_pnbp.define("t_create_bill_header",
  {
    id_trx_svr: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_trx_upt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_trx_kl: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    kd_upt: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    no_bill: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date_bill: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_bill_exp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    kd_kl: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    kd_es1: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    kd_satker: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    jns_pnbp: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    mt_uang: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    total_nominal: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    jns_wjb_byr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nm_wjb_byr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email_trd: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nm_cp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email_cp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email_pic_pnbp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email_status: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    kd_satker_pemungut: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    npwp: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    datecreated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    jns_input: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    note_update: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    FLAG_TRANSACTION: {
      type: DataTypes.STRING(1),
      allowNull: true
    }
  }, {
  Sequelize,
  tableName: 't_create_bill_header',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "id_trx_svr" },
      ]
    },
  ]
});

export default T_create_bill_header;
