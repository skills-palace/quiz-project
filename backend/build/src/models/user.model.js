"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { SECRET, REFRESH_SECRET, RESET_SECRET } = config_1.default.get("JWT");
const userSchema = new mongoose_1.Schema({
    fname: { type: String, trim: true },
    lname: { type: String, trim: true },
    username: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    role: {
        type: Number,
        default: 2,
        Enum: [1, 2, 3, 4],
        // comment: "1=admin 2=student 3=teacher 4=family",
    },
    status: {
        type: Number,
        default: 1,
        enum: [0, 1],
    },
    wishlist: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Lesson" }],
        select: false,
    },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    refresh_token: { type: String, select: false },
    subscriptionPlan: {
        type: String,
        enum: ["explorer", "learner"],
        default: "explorer",
    },
    explorerTrialEndsAt: { type: Date, default: null },
}, { timestamps: true });
userSchema.methods = {
    jwtRefreshToken() {
        const _id = this._id;
        const token = jsonwebtoken_1.default.sign({ _id }, REFRESH_SECRET, {
            expiresIn: "1y",
        });
        this.refreshToken = token;
        return token;
    },
    jwtToken() {
        const _id = this._id;
        const role = this.role;
        return jsonwebtoken_1.default.sign({ _id, role }, SECRET, {
            expiresIn: "60s",
        });
    },
    jwtPassResetToken() {
        const _id = this._id;
        const resetToken = jsonwebtoken_1.default.sign({ _id }, RESET_SECRET, {
            expiresIn: "1h",
        });
        return resetToken;
    },
};
exports.default = (0, mongoose_1.model)("User", userSchema);
