import { Model, Schema, model } from "mongoose";

interface IMedia {
  name: string;
}
interface IMediaDocument extends IMedia, Document {}
interface IMediaModel extends Model<IMediaDocument> {}

const mediaSchema: Schema<IMediaDocument> = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IMediaDocument, IMediaModel>("Media", mediaSchema);
