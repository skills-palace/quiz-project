"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const joi_1 = require("joi");
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = Object.assign({ message: "Internal server error", type: "server_error" }, (config_1.default.get("DEBUG_MODE") && {
        original_error: err.message,
    }));
    if (err instanceof ErrorHandler_1.default) {
        statusCode = err.status;
        data = {
            type: err.type,
            message: err.message,
        };
    }
    if (err.code === 11000 || err.code === 11001) {
        statusCode = 403;
        const field = Object.keys(err.keyValue)[0];
        data = {
            type: "unique",
            message: `${field} '${err.keyValue[field]}' already exists`,
        };
    }
    if (err.name === "ValidationError") {
        statusCode = 403;
        data = { type: err.type, message: err.message };
    }
    if (err instanceof joi_1.ValidationError) {
        statusCode = 403;
        data = { type: "validation", message: err.details[0].message };
    }
    return res.status(statusCode).json(data);
};
exports.default = errorHandler;
