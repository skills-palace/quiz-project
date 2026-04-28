import {
  createSkill,
  deleteSkill,
  getSkillById,
  getSkills,
  updateSkill,
  updateSkillsOrder,
} from "../controllers/skill.controller";

const route = require("express").Router();

//------- brand routes -------- //
route.post("/", createSkill);
route.post("/order", updateSkillsOrder);
route.get("/", getSkills);
route.get("/:id", getSkillById);
route.patch("/:id", updateSkill);
route.delete("/:id", deleteSkill);

module.exports = route;
