"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const skillSchema = new mongoose_1.Schema({
    skill: {
        type: String,
        required: true,
        unique: true,
    },
    subject: {
        type: String,
        required: true,
    },
    order: { type: Number, default: 0 },
    grade: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Skill = (0, mongoose_1.model)("Skill", skillSchema);
exports.default = Skill;
