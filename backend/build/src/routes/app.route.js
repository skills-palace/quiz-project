"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const app_controller_1 = __importDefault(require("../controllers/app.controller"));
const auth_1 = __importDefault(require("../middlewares/auth"));
//------- option routes -------- //
route.get("/dashboard-home", (0, auth_1.default)([1]), app_controller_1.default.dashboardHome);
route.get("/contact-us", (0, auth_1.default)([1]), app_controller_1.default.contactMessages);
route.post("/contact-us", app_controller_1.default.store);
route.post("/contact-us/:id/reply", (0, auth_1.default)([1]), app_controller_1.default.replyContactMessage);
route.delete("/contact-us/:id", (0, auth_1.default)([1]), app_controller_1.default.deleteContactMessage);
module.exports = route;
