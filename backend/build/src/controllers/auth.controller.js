"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const config_1 = __importDefault(require("config"));
const subscription_1 = require("../utils/subscription");
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
function authUserPayload(user) {
    var _a;
    return {
        _id: user._id,
        fname: user.fname,
        role: user.role,
        phone: user.phone,
        email: user.email,
        subscriptionPlan: (_a = user.subscriptionPlan) !== null && _a !== void 0 ? _a : "explorer",
        explorerTrialEndsAt: (0, subscription_1.getExplorerTrialEndIso)(user),
    };
}
const authController = {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const loginSchema = joi_1.default.object({
                email: joi_1.default.string().required().max(80),
                password: joi_1.default.string().required().max(80),
            });
            const { error } = loginSchema.validate({ email, password });
            if (error) {
                return next(error);
            }
            const user = yield user_model_1.default.findOne({ email }).select("+password");
            if (!user) {
                return next(ErrorHandler_1.default.notFound("user not found"));
            }
            if (!user.status) {
                return next(ErrorHandler_1.default.error("Your account is not active"));
            }
            //compare user password
            const match = yield bcryptjs_1.default.compare(password, user.password);
            if (!match) {
                return next(ErrorHandler_1.default.error("password or email not match"));
            }
            const accessToken = user.jwtToken();
            const refreshToken = user.jwtRefreshToken();
            user.save((error) => {
                if (error) {
                    return next(error);
                }
            });
            if (req.query["set-cookie"]) {
                // res.cookie("refresh_token", refreshToken, {
                //   maxAge: 1000 * 60 * 60 * 24 * 365,
                //   httpOnly: true,
                // });
                // res.cookie("access_token", accessToken, {
                //   maxAge: 1000 * 60 * 60 * 24,
                //   httpOnly: true,
                // });
            }
            const userInfo = authUserPayload(user);
            return res.status(200).json({
                result: userInfo,
                accessToken: accessToken,
                refreshToken: refreshToken,
                message: "login success",
            });
        });
    },
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, googleId, fname, lname } = req.body;
                console.log(req.body);
                let user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    user = new user_model_1.default({
                        email,
                        fname,
                        lname,
                        googleId,
                        status: 1,
                        subscriptionPlan: "explorer",
                        explorerTrialEndsAt: new Date(Date.now() + WEEK_MS),
                    });
                    yield user.save();
                }
                else if (!user.googleId) {
                    user.googleId = googleId;
                    yield user.save();
                }
                const accessToken = user.jwtToken();
                const refreshToken = user.jwtRefreshToken();
                // const accessToken = jwt.sign({ _id: user._id, role: user.role }, SECRET, {
                //   expiresIn: "60s",
                // });
                // const refreshToken = jwt.sign({ _id: user._id }, REFRESH_SECRET, {
                //   expiresIn: "1y",
                // });
                return res.status(200).json({
                    result: authUserPayload(user),
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    message: "Login success",
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    },
    facebookLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, facebookId, fname, lname } = req.body;
                console.log(req.body);
                let user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    user = new user_model_1.default({
                        email,
                        fname,
                        lname,
                        facebookId,
                        status: 1,
                        subscriptionPlan: "explorer",
                        explorerTrialEndsAt: new Date(Date.now() + WEEK_MS),
                    });
                    yield user.save();
                }
                else if (!user.facebookId) {
                    user.facebookId = facebookId;
                    yield user.save();
                }
                const accessToken = user.jwtToken();
                const refreshToken = user.jwtRefreshToken();
                // const accessToken = jwt.sign({ _id: user._id, role: user.role }, SECRET, {
                //   expiresIn: "60s",
                // });
                // const refreshToken = jwt.sign({ _id: user._id }, REFRESH_SECRET, {
                //   expiresIn: "1y",
                // });
                return res.status(200).json({
                    result: authUserPayload(user),
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    message: "Login success",
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    },
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            return res.status(200).json({
                message: "log out success",
            });
        });
    },
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const registerSchema = joi_1.default.object({
                fname: joi_1.default.string().max(20).required().label("first name"),
                lname: joi_1.default.string().max(20).required().label("last name"),
                username: joi_1.default.string().max(40).required().label("user name"),
                email: joi_1.default.string().max(80).required(),
                //.custom((v) => v.toLowerString()),
                phone: joi_1.default.string(),
                role: joi_1.default.number().default(2).valid(2, 3, 4),
                password: joi_1.default.string().required().max(80),
                confirm_password: joi_1.default.string().required().valid(joi_1.default.ref("password")),
            });
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            //check if user in DB
            const isExist = yield user_model_1.default.findOne({ email });
            if (isExist) {
                return next(ErrorHandler_1.default.error("email is already exist"));
            }
            //  has password
            const hashPassword = yield bcryptjs_1.default.hash(password, 10);
            try {
                const user = yield user_model_1.default.create(Object.assign(Object.assign({}, value), { password: hashPassword, subscriptionPlan: "explorer", explorerTrialEndsAt: new Date(Date.now() + WEEK_MS) }));
                const accessToken = user.jwtToken();
                const refreshToken = user.jwtRefreshToken();
                user.save((err) => {
                    if (err)
                        return next(err);
                });
                const userInfo = authUserPayload(user);
                return res.status(200).json({
                    result: userInfo,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    message: "Registation Successfull",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return next(ErrorHandler_1.default.unAuthorize("Token not found"));
            }
            const refreshToken = authHeader.split(" ")[1];
            try {
                const { _id } = jsonwebtoken_1.default.verify(refreshToken, config_1.default.get("JWT.REFRESH_SECRET"));
                const user = yield user_model_1.default.findById(_id).select("+refreshToken");
                if (!user) {
                    return next(ErrorHandler_1.default.unAuthorize("Token is not valid"));
                }
                if (user.status !== 1) {
                    return next(ErrorHandler_1.default.error("Your account is not active"));
                }
                const accessToken = user.jwtToken();
                return res.status(200).json({
                    accessToken,
                    message: "Access token generated successfully",
                });
            }
            catch (error) {
                return next(ErrorHandler_1.default.unAuthorize("Token validation failed"));
            }
        });
    },
};
exports.default = authController;
