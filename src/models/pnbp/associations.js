import Payment from "./t_payment.js";
import BillHeader from "./t_create_bill_header.js";
import BillDetail from "./t_create_bill_detail.js";
import Tb_bank from "./tb_bank.js";

// Relasi Payment → BillHeader
Payment.belongsTo(BillHeader, {
  foreignKey: "id_trx_svr_header",
  targetKey: "id_trx_svr",
  as: "billHeader"
});

// Relasi BillHeader → BillDetail
BillHeader.hasMany(BillDetail, {
  foreignKey: "id_trx_upt",
  sourceKey: "id_trx_upt",
  as: "billDetails"
});

// Opsional: jika butuh reverse relation
BillDetail.belongsTo(BillHeader, {
  foreignKey: "id_trx_upt",
  targetKey: "id_trx_upt",
  as: "header"
});

// 🔹 Relasi Payment → Bank
Payment.belongsTo(Tb_bank, {
  foreignKey: "bank_id",
  targetKey: "bank_id",
  as: "bank"
});

// Opsional: reverse relation kalau mau
Tb_bank.hasMany(Payment, {
  foreignKey: "bank_id",
  sourceKey: "bank_id",
  as: "payments"
});

export { Payment, BillHeader, BillDetail, Tb_bank };
