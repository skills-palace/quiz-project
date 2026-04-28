import { Request, Response } from "express";
import Skill from "../models/skills.model";

// Create a new skill
export const createSkill = async (req: Request, res: Response) => {
  try {
    const { skill, subject, grade } = req.body;

    const newSkill = new Skill({
      skill,
      subject,
      grade,
    });

    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: "Failed to create skill", error });
  }
};

// Get all skills ordered by the 'order' field
export const getSkills = async (req: Request, res: Response) => {
  try {
    // Fetch all skills and sort by 'order' field in ascending order
    const skills = await Skill.find().sort({ order: 1 }); // 1 for ascending order
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skills', error });
  }
};


// Get a skill by ID
export const getSkillById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skill", error });
  }
};

// Update a skill by ID
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { skill, subject, grade } = req.body;

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { skill, subject, grade },
      { new: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: "Failed to update skill", error });
  }
};

// Delete a skill by ID
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill", error });
  }
};

// Update the order of skills
export const updateSkillsOrder = async (req: Request, res: Response) => {
  try {
    const { orderedSkills } = req.body; // An array of skill IDs in the desired order

    for (let i = 0; i < orderedSkills.length; i++) {
      await Skill.findByIdAndUpdate(orderedSkills[i], { order: i + 1 });
    }

    res.status(200).json({ message: "Skills order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update skills order", error });
  }
};
