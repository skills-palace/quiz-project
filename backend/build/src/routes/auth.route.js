"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const controllers_1 = require("../controllers");
//------- brand routes -------- //
route.post("/login", controllers_1.authController.login);
route.post("/google-login", controllers_1.authController.googleLogin);
route.post("/facebook-login", controllers_1.authController.facebookLogin);
route.get("/refresh-token", controllers_1.authController.refreshToken);
route.post("/register", controllers_1.authController.register);
route.post("/logout", controllers_1.authController.logout);
module.exports = route;
