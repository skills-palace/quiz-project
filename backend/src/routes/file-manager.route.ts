const route = require("express").Router();
import fileManagerController from "../controllers/file-manager.controller";
import auth from "../middlewares/auth";
import uploader from "../services/file-uploader";

//------- admin handle file manager routes -------- //
route.get("/", auth([1]), fileManagerController.index);
route.post("/", auth([1]), uploader, fileManagerController.store);
route.delete("/:file", auth([1]), fileManagerController.destroy);

module.exports = route;
