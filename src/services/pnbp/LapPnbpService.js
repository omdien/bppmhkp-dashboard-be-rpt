import LapPnbpRepository from "../../repositories/pnbp/LapPnbpRepository.js";

class LapPnbpService {

  // ✅ Helper membangun filters agar tidak duplikasi
  _buildFilters(query) {
    return {
      kdUpt:      query.kdUpt      || null,   // ✅ ditambahkan
      startDate:  query.startDate  || null,
      endDate:    query.endDate    || null,
      negara:     query.negara     || null,
      kd_tarif:   query.kd_tarif   || null,
    };
  }

  async getLaporan(query) {
    const filters = this._buildFilters(query);
    const page    = Number(query.page)  || 1;
    const limit   = Number(query.limit) || 50;

    return await LapPnbpRepository.getFiltered(filters, page, limit);
  }

  async getLaporanForExport(query) {
    const filters = this._buildFilters(query);

    // ✅ Logic ada di repository, service hanya mendelegasikan
    return await LapPnbpRepository.getAllForExport(filters);
  }
}

export default new LapPnbpService();