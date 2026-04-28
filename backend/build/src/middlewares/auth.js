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
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const auth = (roles = []) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Get the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(ErrorHandler_1.default.unAuthorize('Token not found'));
        }
        // Extract the token
        const accessToken = authHeader.split(' ')[1];
        try {
            const user = jsonwebtoken_1.default.verify(accessToken, config_1.default.get('JWT.SECRET'));
            if (!roles.includes(user.role)) {
                return next(ErrorHandler_1.default.unAuthorize('Unauthorized access'));
            }
            req.user = user;
            next();
        }
        catch (error) {
            return next(ErrorHandler_1.default.unAuthorize('Token invalid or expired'));
        }
    });
};
exports.default = auth;
