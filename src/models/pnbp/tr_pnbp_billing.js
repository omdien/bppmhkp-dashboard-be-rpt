const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tr_pnbp_billing', {
    idbill: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    no_bill: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tgl_bill: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_tagihan: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total_pembayaran: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    jns_pembayaran: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sts_pembayaran: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    ket: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    date_modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    nip_op: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nm_op: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    id_trx_create_bill_upt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_trx_create_bill_kl: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nm_wjb_byr: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    jns_wjb_byr: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    npwp_wjb_byr: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    tgl_bill_exp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_trx_chk_payment_upt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_trx_chk_payment_kl: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ntb: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ntpn: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tgl_payment: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bank: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nm_bank: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    channel: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    tgl_pembukuan: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    sts_print: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    synch: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    stat_mail: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    mail_trd: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nm_pj: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mail_pj: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    file_attach: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    file_attach_payment: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    mtd: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    inpt: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    mail_pnbp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tr_pnbp_billing',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idbill" },
        ]
      },
    ]
  });
};
