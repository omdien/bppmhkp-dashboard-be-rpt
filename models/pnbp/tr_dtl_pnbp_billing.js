const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tr_dtl_pnbp_billing', {
    iddtlbill: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    idbill: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_pnbp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_pnbp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tgl_pnbp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    nomor_aju: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    kode_tarif: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    date_modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    kode_akun: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    kd_tarif_simponi: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    volume: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    satuan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tarif: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    pembagi: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total_tarif: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tr_dtl_pnbp_billing',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "iddtlbill" },
        ]
      },
    ]
  });
};
