import { Model, Schema, model } from "mongoose";

interface ILesson {
  title: string;
  subject: string;
  grade: string;
  total_mark: number;
  description: string;
  author: any;
  quizes: any;
  skill: any;
  time: number;
  imagePath:string;
  audioPath: string;
  status: number;
  hideParagraphSide: number;
}
interface ILessonDocument extends ILesson, Document {}
interface ILessonModel extends Model<ILessonDocument> {}

const LessonSchema: Schema<ILessonDocument> = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    total_mark: { type: Number, required: true },
    description: { type: String },
    audioPath: { type: String },
    imagePath: { type: String },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    quizes: [{ type: Schema.Types.ObjectId, ref: "Quiz", required: true }],
    skill: { type: Schema.Types.ObjectId, required: true, ref: "Skill" },
    time: { type: Number, required: true },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1],
    },
    hideParagraphSide: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
  },
  { timestamps: true }
);

export default model<ILessonDocument, ILessonModel>("Lesson", LessonSchema);
