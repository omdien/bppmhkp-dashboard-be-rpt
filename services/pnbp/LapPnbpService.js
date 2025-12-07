import LapPnbpRepository from "../../repositories/pnbp/LapPnbpRepository.js";

class LapPnbpService {
  
  async getLaporan(query) {
    const filters = {
      startDate: query.startDate || null,
      endDate: query.endDate || null,
      negara: query.negara || null,
      kd_tarif: query.kd_tarif || null,
    };

    return await LapPnbpRepository.getFiltered(filters);
  }

}

export default new LapPnbpService();
