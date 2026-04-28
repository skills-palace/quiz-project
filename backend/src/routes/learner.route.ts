const route = require("express").Router();
import auth from "../middlewares/auth";
import { learnerController } from "../controllers";

//------- admin handle media routes -------- //
route.get("/", auth([3, 4]), learnerController.index);
route.post("/", auth([3, 4]), learnerController.store);
route.patch("/:id", auth([3, 4]), learnerController.update);
route.delete("/:id", auth([3, 4]), learnerController.destroy);

module.exports = route;
