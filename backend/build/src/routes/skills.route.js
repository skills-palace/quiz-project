"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skill_controller_1 = require("../controllers/skill.controller");
const route = require("express").Router();
//------- brand routes -------- //
route.post("/", skill_controller_1.createSkill);
route.post("/order", skill_controller_1.updateSkillsOrder);
route.get("/", skill_controller_1.getSkills);
route.get("/:id", skill_controller_1.getSkillById);
route.patch("/:id", skill_controller_1.updateSkill);
route.delete("/:id", skill_controller_1.deleteSkill);
module.exports = route;
