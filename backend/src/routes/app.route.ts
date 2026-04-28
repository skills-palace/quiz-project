const route = require("express").Router();
import appController from "../controllers/app.controller";
import auth from "../middlewares/auth";

//------- option routes -------- //
route.get("/dashboard-home", auth([1]), appController.dashboardHome);
route.get("/contact-us", auth([1]), appController.contactMessages);
route.post("/contact-us", appController.store);
route.post("/contact-us/:id/reply", auth([1]), appController.replyContactMessage);
route.delete("/contact-us/:id", auth([1]), appController.deleteContactMessage);

module.exports = route;
