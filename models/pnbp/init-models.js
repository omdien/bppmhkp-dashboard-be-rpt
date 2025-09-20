var DataTypes = require("sequelize").DataTypes;
var _t_create_bill_detail = require("./t_create_bill_detail");
var _t_create_bill_header = require("./t_create_bill_header");
var _t_payment = require("./t_payment");
var _tb_bank = require("./tb_bank");
var _tb_ca = require("./tb_ca");
var _tb_channel = require("./tb_channel");
var _tb_satker_keuangan = require("./tb_satker_keuangan");
var _tb_token = require("./tb_token");
var _tr_dtl_pnbp_billing = require("./tr_dtl_pnbp_billing");
var _tr_pnbp_billing = require("./tr_pnbp_billing");

function initModels(sequelize) {
  var t_create_bill_detail = _t_create_bill_detail(sequelize, DataTypes);
  var t_create_bill_header = _t_create_bill_header(sequelize, DataTypes);
  var t_payment = _t_payment(sequelize, DataTypes);
  var tb_bank = _tb_bank(sequelize, DataTypes);
  var tb_ca = _tb_ca(sequelize, DataTypes);
  var tb_channel = _tb_channel(sequelize, DataTypes);
  var tb_satker_keuangan = _tb_satker_keuangan(sequelize, DataTypes);
  var tb_token = _tb_token(sequelize, DataTypes);
  var tr_dtl_pnbp_billing = _tr_dtl_pnbp_billing(sequelize, DataTypes);
  var tr_pnbp_billing = _tr_pnbp_billing(sequelize, DataTypes);


  return {
    t_create_bill_detail,
    t_create_bill_header,
    t_payment,
    tb_bank,
    tb_ca,
    tb_channel,
    tb_satker_keuangan,
    tb_token,
    tr_dtl_pnbp_billing,
    tr_pnbp_billing,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
