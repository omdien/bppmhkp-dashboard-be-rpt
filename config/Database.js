import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const db_ekspor = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '+07:00'
});

export const db_hc = new Sequelize(process.env.DB_NAME_HC, process.env.DB_USER_SIAP_MUTU, process.env.DB_PASS_SIAP_MUTU, {
    host: process.env.DB_HOST_SIAP_MUTU,
    dialect: 'mysql'
});

export const db_mutu = new Sequelize(process.env.DB_NAME_MUTU, process.env.DB_USER_SIAP_MUTU, process.env.DB_PASS_SIAP_MUTU, {
    host: process.env.DB_HOST_SIAP_MUTU,
    dialect: 'mysql',
    timezone: '+07:00'
});

export const db_pnbp = new Sequelize(process.env.DB_NAME_PNBP, process.env.DB_USER_SIAP_MUTU, process.env.DB_PASS_SIAP_MUTU, {
    host: process.env.DB_HOST_SIAP_MUTU,
    dialect: 'mysql',
    timezone: '+07:00'
});