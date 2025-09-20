const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_satker_keuangan', {
    kd_upt: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    kd_satker: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    kd_lokasi: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    kd_kabkota: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tb_satker_keuangan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "kd_upt" },
        ]
      },
    ]
  });
};
