import { Sequelize } from "sequelize";
import db_mutu from "../../config/Database.js";
import Tr_oss_checklist from "./tr_oss_checklist.js";  

const { DataTypes } = Sequelize;

const Tb_perizinan = db_mutu.define(
  "tb_perizinan",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    kd_izin: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    ur_izin: DataTypes.STRING,
    ur_izin_singkat: DataTypes.STRING(50),
    kd_pusat: DataTypes.STRING(2),
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

// Tb_perizinan.hasMany(Tr_oss_checklist, {
//   foreignKey: 'kd_izin',
//   sourceKey: 'kd_izin',
//   as: 'OssChecklists'
// });

export default Tb_perizinan;

