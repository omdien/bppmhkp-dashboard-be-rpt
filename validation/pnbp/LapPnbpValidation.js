import { query } from "express-validator";

export const validateLapPnbp = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Format tanggal salah"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Format tanggal salah")
    .custom((endDate, { req }) => {
      const startDate = req.query.startDate;

      // jika salah satunya tidak diisi → lolos (karena optional)
      if (!startDate || !endDate) return true;

      // Bandingkan tanggal
      if (new Date(endDate) < new Date(startDate)) {
        throw new Error("endDate harus lebih besar atau sama dengan startDate");
      }

      return true;
    }),

  query("negara").optional().isString(),
  query("kd_tarif").optional().isString(),
];
