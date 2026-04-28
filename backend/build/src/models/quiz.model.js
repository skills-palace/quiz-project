"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const QuizSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    total_mark: { type: Number, required: true },
    description: { type: String, required: false },
    author: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    quizes: { type: Array, required: true },
    alternativeSequences: { type: Array, default: [] },
    audioPath: { type: String },
    questionAudio: { type: String },
    meta: { type: Object },
    raw: { type: Array, required: true },
    status: { type: Number, default: 0, enum: [0, 1] },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Quiz', QuizSchema);
