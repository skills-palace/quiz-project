"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const controllers_1 = require("../controllers");
//------- option routes -------- //
route.get("/", controllers_1.optionController.index);
module.exports = route;
