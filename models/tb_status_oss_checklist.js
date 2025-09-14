import { Sequelize } from "sequelize";
import db_mutu from "../config/Database.js";

const { DataTypes } = Sequelize;

const Tb_status_oss_checklist = db_mutu.define(
  "tb_status_oss_checklist",
  {
    id_sts_checklist: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sts_checklist: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    keterangan: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  }, {
  Sequelize,
  tableName: 'tb_status_oss_checklist',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "id_sts_checklist" },
      ]
    },
  ]
});

export default Tb_status_oss_checklist;
