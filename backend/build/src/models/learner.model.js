"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LearnerSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    code: { type: String, required: true },
    grade: { type: String, required: true },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true,
    },
    status: { type: Number, default: 0, enum: [0, 1] },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Learner", LearnerSchema);
