import { Schema, model, Document } from "mongoose";

interface ISkill extends Document {
  skill: string;
  subject: string;
  grade: string;
  order: number;
}

const skillSchema = new Schema<ISkill>(
  {
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
  },
  {
    timestamps: true,
  }
);

const Skill = model<ISkill>("Skill", skillSchema);

export default Skill;
