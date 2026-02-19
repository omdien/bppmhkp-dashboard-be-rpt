const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_token', {
    id_token: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nm_token: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    code_token: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tb_token',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_token" },
        ]
      },
    ]
  });
};
