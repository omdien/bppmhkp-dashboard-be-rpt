const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_ca', {
    ca_id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true
    },
    ca_name: {
      type: DataTypes.STRING(85),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tb_ca',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ca_id" },
        ]
      },
    ]
  });
};
