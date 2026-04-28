import { Schema, model } from "mongoose";

interface IContactMessage {
  name: string;
  email: string;
  message: string;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default model<IContactMessage>(
  "ContactMessage",
  contactMessageSchema
);
