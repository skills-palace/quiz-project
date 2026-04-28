"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LearnGroupSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
    total_student: { type: Number, required: true },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("LearnGroup", LearnGroupSchema);
