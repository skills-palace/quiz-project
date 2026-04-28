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
const learn_group_model_1 = __importDefault(require("../models/learn-group.model"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const learnGroupController = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, title, status, limit } = req.query;
            const _id = req.user._id;
            const role = req.user.role;
            if (!_id || !role) {
                return next(ErrorHandler_1.default.unAuthorize("Token not found"));
            }
            const query = {};
            if (!(role === 1))
                query.author = _id;
            if (title)
                query.title = { $regex: title, $options: "i" };
            if (status)
                query.status = status;
            const _page = +page || 1;
            const _limit = +limit || 10;
            const offset = _limit * (_page - 1);
            const total = yield learn_group_model_1.default.countDocuments(query);
            try {
                const learnGroups = yield learn_group_model_1.default.find(query)
                    .skip(offset)
                    .limit(_limit)
                    .sort({ $natural: -1 })
                    .populate("students");
                //  .select(["name", "email"]);
                return res.status(200).json({
                    result: learnGroups,
                    page: _page,
                    limit: _limit,
                    total,
                    count: learnGroups.length,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    store(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, student_ids, description } = req.body;
            // const { _id } = req.user;
            const _id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
            const role = req.user.role;
            if (!_id || !role) {
                return next(ErrorHandler_1.default.unAuthorize("Token not found"));
            }
            try {
                yield learn_group_model_1.default.create({
                    name: name,
                    students: student_ids,
                    total_student: student_ids.length,
                    author: _id,
                    description,
                });
                return res.status(200).json({ message: "group created successfully" });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    update(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, student_ids, description } = req.body;
            const id = req.params.id;
            const _id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
            const role = req.user.role;
            console.log("i am here to update");
            if (!_id || !role) {
                return next(ErrorHandler_1.default.unAuthorize("Token not found"));
            }
            try {
                const group = yield learn_group_model_1.default.findById(id);
                if (!group) {
                    return res.status(404).json({ message: "Group not found" });
                }
                // Update the group fields
                group.name = name;
                group.students = student_ids;
                group.total_student = student_ids.length;
                group.author = _id;
                group.description = description;
                yield group.save();
                return res.status(200).json({ message: "Group updated successfully" });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield learn_group_model_1.default.findByIdAndDelete(req.params.id);
                if (!doc) {
                    return next(ErrorHandler_1.default.notFound("No data found to delete"));
                }
                return res.status(200).json({
                    message: "lesson deleted successfully",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
};
exports.default = learnGroupController;
