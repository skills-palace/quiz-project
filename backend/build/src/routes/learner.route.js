"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const auth_1 = __importDefault(require("../middlewares/auth"));
const controllers_1 = require("../controllers");
//------- admin handle media routes -------- //
route.get("/", (0, auth_1.default)([3, 4]), controllers_1.learnerController.index);
route.post("/", (0, auth_1.default)([3, 4]), controllers_1.learnerController.store);
route.patch("/:id", (0, auth_1.default)([3, 4]), controllers_1.learnerController.update);
route.delete("/:id", (0, auth_1.default)([3, 4]), controllers_1.learnerController.destroy);
module.exports = route;
