"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const auth_1 = __importDefault(require("../middlewares/auth"));
const controllers_1 = require("../controllers");
//------- admin handle learner group routes -------- //
route.get("/", (0, auth_1.default)([1, 3]), controllers_1.learnGroupController.index);
route.post("/", (0, auth_1.default)([1, 3]), controllers_1.learnGroupController.store);
route.delete("/:id", (0, auth_1.default)([1, 3]), controllers_1.learnGroupController.destroy);
route.patch("/:id", (0, auth_1.default)([1, 3]), controllers_1.learnGroupController.update);
module.exports = route;
