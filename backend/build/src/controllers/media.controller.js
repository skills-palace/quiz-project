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
const mediaController = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield media_model_1.default.find({}).limit(10);
            return res.status(200).json({
                result: files,
                message: "media fetch successfully",
            });
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // upload(req, res, async (err:any) => {
            //   if (err) {
            //     return next(err);
            //   }
            //   if (!req.file) {
            //     return next(ErrorHandler.notFound("No file found"));
            //   }
            //   const file = new Media({ name: req.file.filename });
            //   try {
            //     await file.save(function (err) {
            //       if (err) {
            //         return next(err);
            //       }
            //       return res
            //         .status(200)
            //         .json({ message: "media created successfully" });
            //     });
            //   } catch (error) {
            //     return next(error);
            //   }
            // });
        });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield media_model_1.default.findOneAndDelete({ name: req.params.name });
            if (!isExist) {
                return next(ErrorHandler_1.default.notFound("item not found"));
            }
            //file removed
            fs_1.default.unlink(`server/uploads/images/${req.params.name}`, (err) => {
                if (err) {
                    return next(ErrorHandler_1.default.serverError());
                }
            });
            return res.status(200).json({ message: "media deleted successfully" });
        });
    },
};
exports.default = mediaController;
