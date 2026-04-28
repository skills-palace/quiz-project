const route = require("express").Router();
import { optionController } from "../controllers";

//------- option routes -------- //
route.get("/", optionController.index);

module.exports = route;
