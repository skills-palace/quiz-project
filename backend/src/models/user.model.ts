import { Schema, model, Model } from "mongoose";
import config from "config";

import jwt from "jsonwebtoken";
const { SECRET, REFRESH_SECRET, RESET_SECRET } = config.get<any>("JWT");

interface IUser {
  fname: string;
  lname: string;
  username: string;
  email: string;
  phone: number;
  /** 1=admin 2=student 3=teacher 4=family */
  role: number;
  wishlist: [any];
  status: number;
  password: string;
  refresh_token: string;
  googleId?: string;
  facebookId?: string;
  /** "explorer" = free trial tier; "learner" = paid / full access. */
  subscriptionPlan?: "explorer" | "learner";
  /** When Explorer free access ends; may be derived from `createdAt` if unset. */
  explorerTrialEndsAt?: Date | null;
}
//comment: "1=user,2=admin,3=vendor",
interface IUserDocument extends IUser, Document {
  jwtRefreshToken: () => string;
  jwtToken: () => string;
  jwtPassResetToken: () => string;
}

interface IUsermModel extends Model<IUserDocument> {}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    fname: { type: String, trim: true },
    lname: { type: String, trim: true },
    username: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    role: {
      type: Number,
      default: 2,
      Enum: [1, 2, 3, 4],
      // comment: "1=admin 2=student 3=teacher 4=family",
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
    wishlist: {
      type: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
      select: false,
    },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    refresh_token: { type: String, select: false },
    subscriptionPlan: {
      type: String,
      enum: ["explorer", "learner"],
      default: "explorer",
    },
    explorerTrialEndsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods = {
  jwtRefreshToken() {
    const _id = this._id;
    const token = jwt.sign({ _id }, REFRESH_SECRET, {
      expiresIn: "1y",
    });
    this.refreshToken = token;
    return token;
  },

  jwtToken() {
    const _id = this._id;
    const role = this.role;
    return jwt.sign({ _id, role }, SECRET, {
      expiresIn: "60s",
    });
  },
  jwtPassResetToken() {
    const _id = this._id;
    const resetToken = jwt.sign({ _id }, RESET_SECRET, {
      expiresIn: "1h",
    });
    return resetToken;
  },
};

export default model<IUserDocument, IUsermModel>("User", userSchema);
