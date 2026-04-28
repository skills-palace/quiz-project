"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    DEBUG_MODE: true,
    PORT: process.env.PORT,
    // DB_URL: "mongodb://127.0.0.1:27017/newskyon_ai",
    DB_URL: process.env.DB_URL,
    JWT: {
        SECRET: process.env.JWT_SECRET,
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        RESET_SECRET: process.env.JWT_RESET_SECRET,
        ACC_ACTIVATION: process.env.JWT_ACC_ACTIVATION,
        ACCESS_TOKEN_TIME: "15m",
        REFRESH_TOKEN_TIME: "1y",
    },
};
