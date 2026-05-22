import LapPnbpService from "../../services/pnbp/LapPnbpService.js";
import ExcelJS from "exceljs";

class LapPnbpController {

  async getLaporan(req, res) {
    try {
      const { data, total, page, limit, totalPages } =
        await LapPnbpService.getLaporan(req.query);

      return res.status(200).json({
        success: true,
        message: "Data laporan PNBP berhasil diambil",
        data,
        pagination: { page, limit, total, totalPages },
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async exportExcel(req, res) {
    try {
      const rows = await LapPnbpService.getLaporanForExport(req.query);

      const workbook  = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Laporan PNBP");

      worksheet.columns = [
        { header: "Nomor Aju",   key: "nomor_aju",     width: 22 },
        { header: "Kode UPT",    key: "kd_unit",       width: 12 }, // ✅ ditambahkan
        { header: "Nama Pendek", key: "nm_pendek",     width: 20 },
        { header: "Pengirim",    key: "nm_pengirim",   width: 25 },
        { header: "Jenis",       key: "jenis",         width: 10 }, // ✅ fix: ekspor→jenis
        { header: "Negara",      key: "uraian_negara", width: 20 },
        { header: "No. PNBP",   key: "no_pnbp",       width: 18 },
        { header: "Tgl PNBP",   key: "tgl_pnbp",      width: 15 },
        { header: "No. Bill",    key: "no_bill",       width: 18 }, // ✅ ditambahkan
        { header: "Kode Tarif",  key: "kd_tarif",      width: 15 },
        { header: "Nama Tarif",  key: "nm_tarif",      width: 25 },
        { header: "Volume",      key: "volume",        width: 10 },
        { header: "Satuan",      key: "satuan",        width: 10 },
        { header: "Tarif",       key: "tarif",         width: 14 },
        { header: "Total Tarif", key: "total_tarif",   width: 16 },
        { header: "PP",          key: "pp",            width: 10 },
        { header: "Status",      key: "status",        width: 12 }, // ✅ ditambahkan
      ];

      // ✅ Gunakan addRow langsung dari dataValues agar tidak mapping manual
      rows.forEach((row) => worksheet.addRow(row.dataValues));

      // Styling header
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD9E1F2" }, // ✅ warna biru muda
        };
        cell.alignment = { horizontal: "center" };
      });
      headerRow.commit();

      const fileName = `laporan_pnbp_${Date.now()}.xlsx`;
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Gagal export Excel: " + error.message,
      });
    }
  }
}

export default new LapPnbpController();