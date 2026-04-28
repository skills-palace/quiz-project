"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const controllers_1 = require("../controllers");
const auth_1 = __importDefault(require("../middlewares/auth"));
//------- user routes -------- //
route.get("/me", (0, auth_1.default)([1, 2, 3, 4]), controllers_1.userController.me);
route.patch("/me", (0, auth_1.default)([1, 2, 3, 4]), controllers_1.userController.updateProfile);
route.get("/", (0, auth_1.default)([1]), controllers_1.userController.index);
route.get("/learner", (0, auth_1.default)([1, 3]), controllers_1.userController.getLearner);
route.post("/", (0, auth_1.default)([1, 3]), controllers_1.userController.store);
route.patch("/:id", (0, auth_1.default)([1]), controllers_1.userController.update);
route.delete("/:id", (0, auth_1.default)([1]), controllers_1.userController.destroy);
module.exports = route;
