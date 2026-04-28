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
const media_model_1 = __importDefault(require("../models/media.model"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const fs_1 = __importDefault(require("fs"));
const fileManagerController = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, role } = req.user;
            const { page, title, status, limit } = req.query;
            const q = {};
            if (role == 3) {
                q.type = 2;
                q.author = _id;
            }
            else {
                if (status)
                    q.status = status;
            }
            if (title)
                q.name = { $regex: title, $options: "i" };
            const pageNumber = +page || 1;
            const pageSize = +limit || 30;
            const offset = pageSize * (pageNumber - 1);
            const total = yield media_model_1.default.countDocuments(q);
            try {
                const result = yield media_model_1.default.find(q)
                    .sort({ _id: -1 })
                    .skip(offset)
                    .limit(pageSize);
                return res.status(200).json({
                    result,
                    page: pageNumber,
                    limit: pageSize,
                    offset,
                    total,
                    count: result.length,
                    message: "media fetch successfully",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, role } = req.user;
            // if (req.fileError) {
            //   return next(ErrorHandler.error(req.fileError));
            // }
            console.log("req.file", req.file);
            if (!req.file) {
                return next(ErrorHandler_1.default.error("file not found"));
            }
            try {
                yield media_model_1.default.create(Object.assign({ name: req.file.filename, author: _id }, (role === 3 && { type: 2 })));
                return res.status(200).json({ message: "media created successfully" });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.params.file;
            const files = file.split(",");
            try {
                yield media_model_1.default.deleteMany({
                    name: { $in: files },
                });
                files.map((name) => {
                    fs_1.default.unlinkSync(`src/public/image/${name}`);
                });
            }
            catch (error) { }
            return res.status(200).json({ message: "media deleted successfully" });
        });
    },
};
exports.default = fileManagerController;
