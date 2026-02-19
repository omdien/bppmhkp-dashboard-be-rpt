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
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * EXPORT TO EXCEL
   */
  async exportExcel(req, res) {
    try {
      // ambil semua data (tanpa pagination)
      const rows = await LapPnbpService.getLaporanForExport(req.query);

      // Buat workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Laporan PNBP");

      // Header kolom
      worksheet.columns = [
        { header: "Nomor Aju", key: "nomor_aju", width: 20 },
        { header: "Nama Pendek", key: "nm_pendek", width: 20 },
        { header: "Pengirim", key: "nm_pengirim", width: 25 },
        { header: "Ekspor", key: "ekspor", width: 10 },
        { header: "Negara", key: "uraian_negara", width: 20 },
        { header: "No. PNBP", key: "no_pnbp", width: 15 },
        { header: "Tgl PNBP", key: "tgl_pnbp", width: 15 },
        { header: "Kode Tarif", key: "kd_tarif", width: 15 },
        { header: "Nama Tarif", key: "nm_tarif", width: 25 },
        { header: "Volume", key: "volume", width: 10 },
        { header: "Satuan", key: "satuan", width: 10 },
        { header: "Tarif", key: "tarif", width: 12 },
        { header: "Total Tarif", key: "total_tarif", width: 15 },
        { header: "PP", key: "pp", width: 10 },
      ];

      // Tambahkan rows
      rows.forEach((row) => {
        worksheet.addRow({
          nomor_aju: row.nomor_aju,
          nm_pendek: row.nm_pendek,
          nm_pengirim: row.nm_pengirim,
          ekspor: row.ekspor,
          uraian_negara: row.uraian_negara,
          no_pnbp: row.no_pnbp,
          tgl_pnbp: row.tgl_pnbp,
          kd_tarif: row.kd_tarif,
          nm_tarif: row.nm_tarif,
          volume: row.volume,
          satuan: row.satuan,
          tarif: row.tarif,
          total_tarif: row.total_tarif,
          pp: row.pp,
        });
      });

      // Styling header tebal
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      // nama file
      const fileName = `laporan_pnbp_${Date.now()}.xlsx`;

      // Header agar browser download file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

      // Kirim file
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
