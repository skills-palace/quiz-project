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
const learner_model_1 = __importDefault(require("../models/learner.model"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const learnerController = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, title, status, limit } = req.query;
            const { _id, role } = req.user;
            const query = {};
            if (role !== 1)
                query.author = _id;
            if (title)
                query.title = { $regex: title, $options: "i" };
            if (status)
                query.status = status;
            const _page = +page || 1;
            const _limit = +limit || 10;
            const offset = _limit * (_page - 1);
            const total = yield learner_model_1.default.countDocuments(query);
            try {
                const learners = yield learner_model_1.default.find(query)
                    .skip(offset)
                    .limit(_limit) // Use _limit here
                    .sort({ _id: -1 })
                    .populate("student", "fname");
                return res.status(200).json({
                    result: learners,
                    page: _page,
                    limit: _limit,
                    total,
                    count: learners.length,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { student, code, grade } = req.body;
            const { _id } = req.user;
            try {
                const isStudentfound = yield learner_model_1.default.findOne({ author: _id, student });
                if (isStudentfound) {
                    return next(ErrorHandler_1.default.error("this student alreay in your list"));
                }
                yield learner_model_1.default.create({
                    student,
                    author: _id,
                    code,
                    grade,
                });
                return res.status(200).json({ message: "student created successfully" });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.user;
            const { student, code, grade } = req.body;
            const { id } = req.params;
            try {
                yield learner_model_1.default.findByIdAndUpdate(id, {
                    student,
                    code,
                    grade,
                });
                return res.status(200).json({ message: "student update successfully" });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield learner_model_1.default.findByIdAndDelete(req.params.id);
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
exports.default = learnerController;
