import { Model, Schema, model } from "mongoose";

interface ILessonLog {
  title: string;
  subject: string;
  grade: string;
  time: Number;
  total_mark: number;
  obtain_mark: number;
  quizes: any;
  lesson: any;
  learner: any;
  answers: any;
  spend_time: string;
}
interface ILessonLogDocument extends ILessonLog, Document {}
interface ILessonLogModel extends Model<ILessonLogDocument> {}

//i need student info,quiz info
const LessonLogSchema: Schema<ILessonLogDocument> = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    learner: { type: Schema.Types.ObjectId, required: true, ref: "Learner" },
    lesson: { type: Schema.Types.ObjectId, required: true, ref: "Lesson" },
    time: { type: Number, required: true },
    total_mark: { type: Number, required: true },
    obtain_mark: { type: Number, required: true },
    quizes: { type: Array, required: true },
    answers: { type: Array, required: true },
    spend_time: { type: String },
  },
  { timestamps: true }
);

export default model<ILessonLogDocument, ILessonLogModel>(
  "LessonLog",
  LessonLogSchema
);
