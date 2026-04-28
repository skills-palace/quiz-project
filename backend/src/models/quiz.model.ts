import { Model, Schema, model } from 'mongoose';

interface IQuiz {
  title: string;
  type: string;
  total_mark: number;
  description: string;
  author: any;
  quizes: any;
  /** Extra accepted full orderings (word_bank / rearrange / reorder) — id arrays, same multiset as `raw` */
  alternativeSequences: string[][];
  meta: {};
  raw: any;
  status: number;
  audioPath: string;
  questionAudio: string;
}

interface IQuizDocument extends IQuiz, Document {}
interface IQuizModel extends Model<IQuizDocument> {}

const QuizSchema: Schema<IQuizDocument> = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    total_mark: { type: Number, required: true },
    description: { type: String, required: false },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    quizes: { type: Array, required: true },
    alternativeSequences: { type: Array, default: [] },
    audioPath: { type: String },
    questionAudio: { type: String },
    meta: { type: Object },
    raw: { type: Array, required: true },
    status: { type: Number, default: 0, enum: [0, 1] },
  },
  { timestamps: true }
);

export default model<IQuizDocument, IQuizModel>('Quiz', QuizSchema);
