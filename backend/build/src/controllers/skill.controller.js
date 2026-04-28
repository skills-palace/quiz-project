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
exports.updateSkillsOrder = exports.deleteSkill = exports.updateSkill = exports.getSkillById = exports.getSkills = exports.createSkill = void 0;
const skills_model_1 = __importDefault(require("../models/skills.model"));
// Create a new skill
const createSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { skill, subject, grade } = req.body;
        const newSkill = new skills_model_1.default({
            skill,
            subject,
            grade,
        });
        yield newSkill.save();
        res.status(201).json(newSkill);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create skill", error });
    }
});
exports.createSkill = createSkill;
// Get all skills ordered by the 'order' field
const getSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all skills and sort by 'order' field in ascending order
        const skills = yield skills_model_1.default.find().sort({ order: 1 }); // 1 for ascending order
        res.status(200).json(skills);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch skills', error });
    }
});
exports.getSkills = getSkills;
// Get a skill by ID
const getSkillById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const skill = yield skills_model_1.default.findById(id);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        res.status(200).json(skill);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch skill", error });
    }
});
exports.getSkillById = getSkillById;
// Update a skill by ID
const updateSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { skill, subject, grade } = req.body;
        const updatedSkill = yield skills_model_1.default.findByIdAndUpdate(id, { skill, subject, grade }, { new: true });
        if (!updatedSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        res.status(200).json(updatedSkill);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update skill", error });
    }
});
exports.updateSkill = updateSkill;
// Delete a skill by ID
const deleteSkill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedSkill = yield skills_model_1.default.findByIdAndDelete(id);
        if (!deletedSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        res.status(200).json({ message: "Skill deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete skill", error });
    }
});
exports.deleteSkill = deleteSkill;
// Update the order of skills
const updateSkillsOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderedSkills } = req.body; // An array of skill IDs in the desired order
        for (let i = 0; i < orderedSkills.length; i++) {
            yield skills_model_1.default.findByIdAndUpdate(orderedSkills[i], { order: i + 1 });
        }
        res.status(200).json({ message: "Skills order updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update skills order", error });
    }
});
exports.updateSkillsOrder = updateSkillsOrder;
