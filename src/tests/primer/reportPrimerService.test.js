import { jest } from '@jest/globals';

/**
 * 1. MOCKING PHASE
 * Kita harus mendefinisikan mock sebelum modul di-import oleh Node.js.
 */

// Buat mock function terpisah agar mudah dipanggil .mockResolvedValue-nya
const mockFindAll = jest.fn();
const mockFetchRepo = jest.fn();

// Mock Model Tb_propinsi (Default Export)
jest.unstable_mockModule("../../models/primer/tb_propinsi.js", () => ({
  default: {
    findAll: mockFindAll
  }
}));

// Mock Repository (Named Exports)
jest.unstable_mockModule("../../repositories/primer/reportPrimerRepository.js", () => ({
  fetchReportPrimerData: mockFetchRepo
}));

/**
 * 2. IMPORT PHASE
 * Gunakan dynamic import agar modul yang di-import menggunakan versi "mock" di atas.
 */
const reportService = await import("../../services/primer/reportPrimerService.js");

describe("Report Service - getRincianReportService", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Harus mengembalikan data yang sudah di-flatten dengan uraian provinsi yang benar", async () => {
    // 1. Setup Mock Data Provinsi
    mockFindAll.mockResolvedValue([
      { KODE_PROPINSI: "32", URAIAN_PROPINSI: "JAWA BARAT" },
      { KODE_PROPINSI: "31", URAIAN_PROPINSI: "DKI JAKARTA" }
    ]);

    // 2. Setup Mock Data Repository
    mockFetchRepo.mockResolvedValue({
      totalRecords: 1,
      rows: [
        {
          get: () => ({
            idchecklist: "CH001",
            kd_daerah: "3275000", // Bekasi
            v_oss_header: { 
                nama_perseroan: "PT Maju Jaya", 
                npwp_perseroan: "01.234" 
            },
            tr_pbumku_laporan_header: {
              tr_pbumku_laporan_file: { 
                  total_hasil: "SESUAI", 
                  keterangan: "Lengkap" 
              }
            }
          })
        }
      ]
    });

    // 3. Execution
    const queryParams = { 
        tgl_awal: "2024-01-01", 
        tgl_akhir: "2024-01-31", 
        page: 1, 
        limit: 10 
    };
    const result = await reportService.getRincianReportService(queryParams);

    // 4. Assertions
    expect(result.data).toHaveLength(1);
    expect(result.data[0].nama_perseroan).toBe("PT Maju Jaya");
    expect(result.data[0].uraian_propinsi).toBe("JAWA BARAT");
    expect(result.data[0].total_hasil).toBe("SESUAI");
    expect(result.pagination.totalRecords).toBe(1);
  });

  test("Harus mengembalikan 'Tidak Diketahui' jika kode provinsi tidak ditemukan", async () => {
    // Setup mock dengan data kosong
    mockFindAll.mockResolvedValue([]);
    mockFetchRepo.mockResolvedValue({
      totalRecords: 1,
      rows: [
        { get: () => ({ kd_daerah: "9900000" }) }
      ]
    });

    const result = await reportService.getRincianReportService({ 
        tgl_awal: "2024-01-01", 
        tgl_akhir: "2024-01-31" 
    });

    expect(result.data[0].uraian_propinsi).toBe("Tidak Diketahui");
  });
});