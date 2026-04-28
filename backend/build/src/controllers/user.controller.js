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
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const subscription_1 = require("../utils/subscription");
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const userController = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, email, name, status, limit, sort } = req.query;
            const query = {};
            const sortBy = { $natural: -1 };
            if (email)
                query.email = { $regex: email, $options: "i" };
            if (name)
                query.name = { $regex: name, $options: "i" };
            if (status)
                query.status = status;
            if (sort) {
                sort === "asc" ? (sortBy.$natural = 1) : (sortBy.$natural = -1);
            }
            const _page = +page || 1;
            const _limit = +limit || 10;
            const offset = _limit * (_page - 1);
            const total = yield user_model_1.default.countDocuments(query);
            try {
                const users = yield user_model_1.default.find(query)
                    .sort(sortBy)
                    .skip(offset)
                    .limit(_limit)
                    .lean();
                const result = users.map((u) => {
                    var _a;
                    const row = Object.assign({}, u);
                    const plan = (_a = u.subscriptionPlan) !== null && _a !== void 0 ? _a : "explorer";
                    row.subscriptionPlan = plan;
                    row.trialEndsAt = (0, subscription_1.getExplorerTrialEndIso)(u);
                    return row;
                });
                return res.status(200).json({
                    result,
                    page: _page,
                    limit: _limit,
                    offset,
                    total,
                    count: result.length,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    getLearner(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, email, name, status, limit, sort } = req.query;
            const q = { role: 2 };
            const query = { role: 2 };
            const sortBy = { _id: -1 };
            if (email)
                query.email = { $regex: email, $options: "i" };
            if (name)
                query.name = { $regex: name, $options: "i" };
            if (status)
                query.status = status;
            if (sort) {
                sort === "asc" ? (sortBy._id = 1) : (sortBy._id = -1);
            }
            const pageNumber = page || 1;
            const pageSize = limit || 10;
            const offset = pageSize * (pageNumber - 1);
            const total = yield user_model_1.default.countDocuments(query);
            try {
                const users = yield user_model_1.default.find(query)
                    .sort(sortBy)
                    .skip(offset)
                    .limit(pageSize);
                //  .select(["name", "email"]);
                return res.status(200).json({
                    result: users,
                    page: pageNumber,
                    limit: pageSize,
                    offset,
                    total,
                    Count: users.length,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const validator = joi_1.default.object({
                fname: joi_1.default.string().min(3).max(40).required(),
                lname: joi_1.default.string().min(3).max(40).required(),
                username: joi_1.default.string().min(1).max(80).required(),
                status: joi_1.default.number().valid(0, 1).default(1),
                role: joi_1.default.number().valid(1, 2, 3, 4).default(2),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().min(3).max(40).required(),
                subscriptionPlan: joi_1.default.string().valid("explorer", "learner").default("explorer"),
                explorerTrialEndsAt: joi_1.default.any().optional(),
            });
            const { error, value } = validator.validate(req.body);
            if (error) {
                return next(error);
            }
            //check if user in DB
            const isExit = yield user_model_1.default.findOne({ email: value.email });
            if (isExit) {
                return next(ErrorHandler_1.default.error("email is taken"));
            }
            const hashPassword = yield bcryptjs_1.default.hash(value.password, 10);
            let explorerTrialEndsAt = null;
            if (value.subscriptionPlan === "learner") {
                explorerTrialEndsAt = null;
            }
            else {
                const raw = value.explorerTrialEndsAt;
                if (raw !== undefined && raw !== null && raw !== "") {
                    const d = new Date(raw);
                    if (Number.isNaN(d.getTime())) {
                        return next(ErrorHandler_1.default.error("Invalid explorer trial end date"));
                    }
                    explorerTrialEndsAt = d;
                }
                else {
                    explorerTrialEndsAt = new Date(Date.now() + WEEK_MS);
                }
            }
            const user = new user_model_1.default({
                fname: value.fname,
                lname: value.lname,
                username: value.username,
                email: value.email,
                role: value.role,
                status: value.status,
                password: hashPassword,
                subscriptionPlan: value.subscriptionPlan,
                explorerTrialEndsAt,
            });
            try {
                yield user.save();
            }
            catch (error) {
                return next(error);
            }
            return res.status(200).json({
                data: user,
                message: "user created successfully",
            });
        });
    },
    me(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rawId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                const userId = rawId ? String(rawId) : "";
                if (!userId) {
                    return next(ErrorHandler_1.default.unAuthorize());
                }
                const user = yield user_model_1.default.findById(userId).lean();
                if (!user) {
                    return next(ErrorHandler_1.default.error("User not found", 404));
                }
                const doc = user;
                delete doc.password;
                delete doc.refresh_token;
                delete doc.wishlist;
                doc.subscriptionPlan = (_b = doc.subscriptionPlan) !== null && _b !== void 0 ? _b : "explorer";
                doc.explorerTrialEndsAt = (0, subscription_1.getExplorerTrialEndIso)(user);
                return res.status(200).json({ result: doc });
            }
            catch (err) {
                return next(err);
            }
        });
    },
    updateProfile(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const rawId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const userId = rawId ? String(rawId) : "";
            if (!userId) {
                return next(ErrorHandler_1.default.unAuthorize());
            }
            const validator = joi_1.default.object({
                fname: joi_1.default.string().allow("").max(40),
                lname: joi_1.default.string().allow("").max(40),
                username: joi_1.default.string().min(1).max(80).required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string().allow("").max(80),
                confirmPassword: joi_1.default.string().allow(""),
            });
            const { error, value } = validator.validate(req.body);
            if (error) {
                return next(error);
            }
            if (value.password) {
                if (value.password.length < 3) {
                    return next(ErrorHandler_1.default.error("Password must be at least 3 characters"));
                }
                if (value.password !== value.confirmPassword) {
                    return next(ErrorHandler_1.default.error("Passwords do not match"));
                }
            }
            const emailTaken = yield user_model_1.default.findOne({
                email: value.email,
                _id: { $ne: userId },
            });
            if (emailTaken) {
                return next(ErrorHandler_1.default.error("email is taken"));
            }
            const updatePayload = {
                fname: value.fname,
                lname: value.lname,
                username: value.username,
                email: value.email,
            };
            if (value.password) {
                updatePayload.password = yield bcryptjs_1.default.hash(value.password, 10);
            }
            try {
                const updated = yield user_model_1.default.findByIdAndUpdate(userId, updatePayload, {
                    new: true,
                }).lean();
                if (!updated) {
                    return next(ErrorHandler_1.default.error("user not found"));
                }
                const doc = updated;
                delete doc.password;
                delete doc.refresh_token;
                delete doc.wishlist;
                return res.status(200).json({
                    message: "Profile updated successfully",
                    result: doc,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    },
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawId = req.params.id || req.body._id;
            const id = rawId ? String(rawId) : "";
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return next(ErrorHandler_1.default.error("Id is Not valid"));
            }
            const validator = joi_1.default.object({
                _id: joi_1.default.string().optional(),
                fname: joi_1.default.string().min(3).max(40).required(),
                lname: joi_1.default.string().min(3).max(40).required(),
                username: joi_1.default.string().min(1).max(80).required(),
                email: joi_1.default.string().email().required(),
                role: joi_1.default.number().valid(1, 2, 3, 4).required(),
                status: joi_1.default.number().valid(0, 1).required(),
                password: joi_1.default.string().allow("").max(80),
                confirmPassword: joi_1.default.string().allow(""),
                subscriptionPlan: joi_1.default.string().valid("explorer", "learner").required(),
                explorerTrialEndsAt: joi_1.default.any().optional(),
            });
            const { error, value } = validator.validate(req.body, {
                stripUnknown: true,
            });
            if (error) {
                return next(error);
            }
            const emailTaken = yield user_model_1.default.findOne({
                email: value.email,
                _id: { $ne: id },
            });
            if (emailTaken) {
                return next(ErrorHandler_1.default.error("email is taken"));
            }
            const updatePayload = {
                fname: value.fname,
                lname: value.lname,
                username: value.username,
                email: value.email,
                role: value.role,
                status: value.status,
                subscriptionPlan: value.subscriptionPlan,
            };
            if (value.subscriptionPlan === "learner") {
                updatePayload.explorerTrialEndsAt = null;
            }
            else if (Object.prototype.hasOwnProperty.call(value, "explorerTrialEndsAt")) {
                const raw = value.explorerTrialEndsAt;
                if (raw === null || raw === "") {
                    updatePayload.explorerTrialEndsAt = null;
                }
                else {
                    const d = new Date(raw);
                    if (Number.isNaN(d.getTime())) {
                        return next(ErrorHandler_1.default.error("Invalid explorer trial end date"));
                    }
                    updatePayload.explorerTrialEndsAt = d;
                }
            }
            if (value.password && String(value.password).trim().length > 0) {
                if (String(value.password).length < 3) {
                    return next(ErrorHandler_1.default.error("Password must be at least 3 characters"));
                }
                if (value.password !== value.confirmPassword) {
                    return next(ErrorHandler_1.default.error("Passwords do not match"));
                }
                updatePayload.password = yield bcryptjs_1.default.hash(value.password, 10);
            }
            try {
                const updateUser = yield user_model_1.default.findByIdAndUpdate(id, updatePayload, {
                    new: true,
                });
                if (!updateUser)
                    return next(ErrorHandler_1.default.error("user not found"));
                return res.status(200).json({
                    message: "account update sucessfully",
                });
            }
            catch (err) {
                return next(err);
            }
        });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return next(ErrorHandler_1.default.error("Id is Not valid"));
            }
            try {
                const data = yield user_model_1.default.findByIdAndDelete(id);
                if (!data) {
                    return next(ErrorHandler_1.default.error("No item found to delete"));
                }
                return res.status(200).json({
                    message: "user deleted successfully",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
};
exports.default = userController;
