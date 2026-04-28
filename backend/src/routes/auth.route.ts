const route = require("express").Router();
import { authController } from "../controllers";

//------- brand routes -------- //
route.post("/login", authController.login);
route.post("/google-login", authController.googleLogin);
route.post("/facebook-login", authController.facebookLogin);
route.get("/refresh-token", authController.refreshToken);
route.post("/register", authController.register);
route.post("/logout", authController.logout);

module.exports = route;
