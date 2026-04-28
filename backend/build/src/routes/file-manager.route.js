"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const file_manager_controller_1 = __importDefault(require("../controllers/file-manager.controller"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const file_uploader_1 = __importDefault(require("../services/file-uploader"));
//------- admin handle file manager routes -------- //
route.get("/", (0, auth_1.default)([1]), file_manager_controller_1.default.index);
route.post("/", (0, auth_1.default)([1]), file_uploader_1.default, file_manager_controller_1.default.store);
route.delete("/:file", (0, auth_1.default)([1]), file_manager_controller_1.default.destroy);
module.exports = route;
