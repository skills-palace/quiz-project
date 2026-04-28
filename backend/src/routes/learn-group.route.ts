const route = require("express").Router();
import auth from "../middlewares/auth";
import { learnGroupController } from "../controllers";

//------- admin handle learner group routes -------- //
route.get("/",  auth([1,3]),learnGroupController.index);
route.post("/", auth([1,3]), learnGroupController.store);
route.delete("/:id", auth([1,3]), learnGroupController.destroy);
route.patch("/:id", auth([1,3]), learnGroupController.update);

module.exports = route;
