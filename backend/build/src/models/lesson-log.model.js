"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//i need student info,quiz info
const LessonLogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    learner: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Learner" },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Lesson" },
    time: { type: Number, required: true },
    total_mark: { type: Number, required: true },
    obtain_mark: { type: Number, required: true },
    quizes: { type: Array, required: true },
    answers: { type: Array, required: true },
    spend_time: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("LessonLog", LessonLogSchema);
