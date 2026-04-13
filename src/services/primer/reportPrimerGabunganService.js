import * as repo from "../../repositories/primer/reportPrimerGabunganRepository.js";

export const getPivotGabunganService = async (start, end) => {
    const [ossResults, kapalResults, propinsiList] = await Promise.all([
        repo.fetchSummaryPrimer(start, end),
        repo.fetchSummaryKapal(start, end),
        repo.fetchAllPropinsi()
    ]);

    const mapIzin = {
        '032000000014': 'CPPIB',
        '032000000034': 'CPIB',
        '032000000019': 'CPOIB',
        '032000000036': 'CDOIB',
        '032000000068': 'CBIB'
    };

    const propinsiMap = {};
    const pivotMap = {};

    // Inisialisasi
    propinsiList.forEach((p) => {
        const kode = String(p.KODE_PROPINSI).padStart(2, '0');
        const nama = p.URAIAN_PROPINSI.toUpperCase();
        propinsiMap[kode] = nama;

        pivotMap[nama] = {
            kode_propinsi: kode,
            propinsi: nama,
            JUMLAH: 0,
            CPPIB: 0,
            CPIB: 0,
            CPOIB: 0,
            CPIB_Kapal: 0,
            CDOIB: 0,
            CBIB: 0
        };
    });

    // 1. Masukkan Data Primer (OSS)
    ossResults.forEach((row) => {
        const kode = String(row.kode_propinsi).padStart(2, '0');
        const namaPropinsi = propinsiMap[kode];
        const labelIzin = mapIzin[row.kd_izin];

        if (namaPropinsi && labelIzin) {
            pivotMap[namaPropinsi][labelIzin] += Number(row.jumlah || 0);
            pivotMap[namaPropinsi].JUMLAH += Number(row.jumlah || 0);
        }
    });

    // 2. Masukkan Data Kapal (293 Jatim ada di sini)
    kapalResults.forEach((row) => {
        const kode = String(row.kode_provinsi).padStart(2, '0');
        const namaPropinsi = propinsiMap[kode];
        
        if (namaPropinsi) {
            // ✅ UBAH: Gunakan CPIB_Kapal (underscore) agar match dengan inisialisasi & frontend
            pivotMap[namaPropinsi].CPIB_Kapal += Number(row.jumlah || 0);
            pivotMap[namaPropinsi].JUMLAH += Number(row.jumlah || 0);
        }
    });

    return Object.values(pivotMap).sort((a, b) => b.JUMLAH - a.JUMLAH);
};