"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    total_mark: { type: Number, required: true },
    description: { type: String },
    audioPath: { type: String },
    imagePath: { type: String },
    author: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    quizes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Quiz", required: true }],
    skill: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Skill" },
    time: { type: Number, required: true },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1],
    },
    hideParagraphSide: {
        type: Number,
        default: 0,
        enum: [0, 1],
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Lesson", LessonSchema);
