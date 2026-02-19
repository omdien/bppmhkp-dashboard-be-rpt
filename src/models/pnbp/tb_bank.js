import { Sequelize } from "sequelize";
import { db_pnbp } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const Tb_bank = db_pnbp.define("tb_bank", {
    bank_id: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    arks: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    Sequelize,
    tableName: 'tb_bank',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bank_id" },
        ]
      },
    ]
  });

  export default Tb_bank;


