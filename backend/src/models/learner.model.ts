import { Model, Schema, model } from "mongoose";

interface ILearner {
  student: any;
  code: string;
  grade: string;
  author: any;
  status: number;
}
interface ILearnerDocument extends ILearner, Document {}
interface ILearnerModel extends Model<ILearnerDocument> {}

const LearnerSchema: Schema<ILearnerDocument> = new Schema(
  {
    student: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    code: { type: String, required: true },
    grade: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    status: { type: Number, default: 0, enum: [0, 1] },
  },
  { timestamps: true }
);

export default model<ILearnerDocument, ILearnerModel>("Learner", LearnerSchema);
