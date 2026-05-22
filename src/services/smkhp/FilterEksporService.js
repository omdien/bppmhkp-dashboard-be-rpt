import FilterEksporRepository from "../../repositories/smkhp/FilterEksporRepository.js";

const FilterEksporService = {
    getNegaraOptions: async () => {
        return await FilterEksporRepository.getNegaraOptions();
    },

    getUptOptions: async () => {
        return await FilterEksporRepository.getUptOptions();
    },

    getKomoditasOptions: async () => {
        return await FilterEksporRepository.getKomoditasOptions();
    },
};

export default FilterEksporService;