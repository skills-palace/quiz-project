import { Schema, model, Document, Model } from "mongoose";

export interface ILearnGroup {
  name: string;
  description: string;
  students: any;
  total_student: number;
  author: any;
}

interface ILearnGroupDocument extends ILearnGroup, Document {
  createdAt: Date;
  updatedAt: Date;
}
interface ILearnGroupModel extends Model<ILearnGroupDocument> {}

const LearnGroupSchema: Schema<ILearnGroupDocument> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    students: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    total_student: { type: Number, required: true },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

export default model<ILearnGroupDocument, ILearnGroupModel>(
  "LearnGroup",
  LearnGroupSchema
);
