import { Sequelize } from "sequelize";
import { db_pnbp } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const T_payment = db_pnbp.define("t_payment",
  {
    id_trx_payment_svr: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_trx_payment_upt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_trx_payment_kl: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_trx_svr_header: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    no_bill: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ntb: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ntpn: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    date_payment: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_pembukuan: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bank_id: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cnl_id: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    mtd_data: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    datecreated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
  Sequelize,
  tableName: 't_payment',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "id_trx_payment_svr" },
      ]
    },
  ]
});

export default T_payment;