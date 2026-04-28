const route = require("express").Router();
import { userController } from "../controllers";
import auth from "../middlewares/auth";
//------- user routes -------- //
route.get("/me", auth([1, 2, 3, 4]), userController.me);
route.patch("/me", auth([1, 2, 3, 4]), userController.updateProfile);
route.get("/", auth([1]), userController.index);
route.get("/learner", auth([1, 3]), userController.getLearner);
route.post("/", auth([1, 3]), userController.store);
route.patch("/:id", auth([1]), userController.update);
route.delete("/:id", auth([1]), userController.destroy);

module.exports = route;
