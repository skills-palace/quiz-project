import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import ErrorHandler from "../services/ErrorHandler";
import User from "../models/user.model";
import { getExplorerTrialEndIso } from "../utils/subscription";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const userController = {
  async index(req: Request, res: Response, next: NextFunction) {
    interface IQuery {
      page: number;
      name: string;
      email: string;
      status: number;
      limit: number;
      sort: "asc" | "desc";
    }
    const { page, email, name, status, limit, sort } =
      req.query as unknown as IQuery;

    interface IFilter {
      email: any;
      name: any;
      status: number;
    }
    const query = <IFilter>{};

    const sortBy: { $natural: any } = { $natural: -1 };

    if (email) query.email = { $regex: email, $options: "i" };
    if (name) query.name = { $regex: name, $options: "i" };
    if (status) query.status = status;

    if (sort) {
      sort === "asc" ? (sortBy.$natural = 1) : (sortBy.$natural = -1);
    }

    const _page = +page || 1;
    const _limit = +limit || 10;
    const offset = _limit * (_page - 1);

    const total = await User.countDocuments(query);

    try {
      const users = await User.find(query)
        .sort(sortBy)
        .skip(offset)
        .limit(_limit)
        .lean();

      const result = users.map((u) => {
        const row = { ...u } as Record<string, unknown>;
        const plan = (u.subscriptionPlan as string) ?? "explorer";
        row.subscriptionPlan = plan;
        row.trialEndsAt = getExplorerTrialEndIso(
          u as {
            subscriptionPlan?: string;
            explorerTrialEndsAt?: Date | null;
            createdAt?: Date;
          }
        );
        return row;
      });

      return res.status(200).json({
        result,
        page: _page,
        limit: _limit,
        offset,
        total,
        count: result.length,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getLearner(req: Request, res: Response, next: NextFunction) {
    interface IQuery {
      page: number;
      name: string;
      email: string;
      status: number;
      limit: number;
      sort: "asc" | "desc";
    }

    const { page, email, name, status, limit, sort } =
      req.query as unknown as IQuery;

    const q = { role: 2 };

    interface IFilter {
      role: number;
      email: any;
      name: any;
      status: number;
    }
    const query = <IFilter>{ role: 2 };

    const sortBy: { _id: any } = { _id: -1 };

    if (email) query.email = { $regex: email, $options: "i" };
    if (name) query.name = { $regex: name, $options: "i" };
    if (status) query.status = status;

    if (sort) {
      sort === "asc" ? (sortBy._id = 1) : (sortBy._id = -1);
    }

    const pageNumber = page || 1;
    const pageSize = limit || 10;
    const offset = pageSize * (pageNumber - 1);

    const total = await User.countDocuments(query);

    try {
      const users = await User.find(query)
        .sort(sortBy)
        .skip(offset)
        .limit(pageSize);
      //  .select(["name", "email"]);

      return res.status(200).json({
        result: users,
        page: pageNumber,
        limit: pageSize,
        offset,
        total,
        Count: users.length,
      });
    } catch (error) {
      return next(error);
    }
  },
  async store(req: Request, res: Response, next: NextFunction) {
    const validator = Joi.object({
      fname: Joi.string().min(3).max(40).required(),
      lname: Joi.string().min(3).max(40).required(),
      username: Joi.string().min(1).max(80).required(),
      status: Joi.number().valid(0, 1).default(1),
      role: Joi.number().valid(1, 2, 3, 4).default(2),
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(40).required(),
      subscriptionPlan: Joi.string().valid("explorer", "learner").default("explorer"),
      explorerTrialEndsAt: Joi.any().optional(),
    });

    const { error, value } = validator.validate(req.body);

    if (error) {
      return next(error);
    }

    //check if user in DB

    const isExit = await User.findOne({ email: value.email });

    if (isExit) {
      return next(ErrorHandler.error("email is taken"));
    }

    const hashPassword = await bcrypt.hash(value.password, 10);

    let explorerTrialEndsAt: Date | null = null;
    if (value.subscriptionPlan === "learner") {
      explorerTrialEndsAt = null;
    } else {
      const raw = value.explorerTrialEndsAt;
      if (raw !== undefined && raw !== null && raw !== "") {
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) {
          return next(ErrorHandler.error("Invalid explorer trial end date"));
        }
        explorerTrialEndsAt = d;
      } else {
        explorerTrialEndsAt = new Date(Date.now() + WEEK_MS);
      }
    }

    const user = new User({
      fname: value.fname,
      lname: value.lname,
      username: value.username,
      email: value.email,
      role: value.role,
      status: value.status,
      password: hashPassword,
      subscriptionPlan: value.subscriptionPlan,
      explorerTrialEndsAt,
    });

    try {
      await user.save();
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({
      data: user,
      message: "user created successfully",
    });
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = (req as Request & { user?: { _id: string } }).user?._id;
      const userId = rawId ? String(rawId) : "";
      if (!userId) {
        return next(ErrorHandler.unAuthorize());
      }
      const user = await User.findById(userId).lean();
      if (!user) {
        return next(ErrorHandler.error("User not found", 404));
      }
      const doc = user as Record<string, unknown>;
      delete doc.password;
      delete doc.refresh_token;
      delete doc.wishlist;
      doc.subscriptionPlan = doc.subscriptionPlan ?? "explorer";
      doc.explorerTrialEndsAt = getExplorerTrialEndIso(
        user as { subscriptionPlan?: string; explorerTrialEndsAt?: Date; createdAt?: Date }
      );
      return res.status(200).json({ result: doc });
    } catch (err) {
      return next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const rawId = (req as Request & { user?: { _id: string } }).user?._id;
    const userId = rawId ? String(rawId) : "";
    if (!userId) {
      return next(ErrorHandler.unAuthorize());
    }

    const validator = Joi.object({
      fname: Joi.string().allow("").max(40),
      lname: Joi.string().allow("").max(40),
      username: Joi.string().min(1).max(80).required(),
      email: Joi.string().email().required(),
      password: Joi.string().allow("").max(80),
      confirmPassword: Joi.string().allow(""),
    });

    const { error, value } = validator.validate(req.body);
    if (error) {
      return next(error);
    }

    if (value.password) {
      if (value.password.length < 3) {
        return next(
          ErrorHandler.error("Password must be at least 3 characters")
        );
      }
      if (value.password !== value.confirmPassword) {
        return next(ErrorHandler.error("Passwords do not match"));
      }
    }

    const emailTaken = await User.findOne({
      email: value.email,
      _id: { $ne: userId },
    });
    if (emailTaken) {
      return next(ErrorHandler.error("email is taken"));
    }

    const updatePayload: Record<string, unknown> = {
      fname: value.fname,
      lname: value.lname,
      username: value.username,
      email: value.email,
    };

    if (value.password) {
      updatePayload.password = await bcrypt.hash(value.password, 10);
    }

    try {
      const updated = await User.findByIdAndUpdate(userId, updatePayload, {
        new: true,
      }).lean();
      if (!updated) {
        return next(ErrorHandler.error("user not found"));
      }
      const doc = updated as Record<string, unknown>;
      delete doc.password;
      delete doc.refresh_token;
      delete doc.wishlist;
      return res.status(200).json({
        message: "Profile updated successfully",
        result: doc,
      });
    } catch (err) {
      return next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const rawId = req.params.id || (req.body as { _id?: string })._id;
    const id = rawId ? String(rawId) : "";

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(ErrorHandler.error("Id is Not valid"));
    }

    const validator = Joi.object({
      _id: Joi.string().optional(),
      fname: Joi.string().min(3).max(40).required(),
      lname: Joi.string().min(3).max(40).required(),
      username: Joi.string().min(1).max(80).required(),
      email: Joi.string().email().required(),
      role: Joi.number().valid(1, 2, 3, 4).required(),
      status: Joi.number().valid(0, 1).required(),
      password: Joi.string().allow("").max(80),
      confirmPassword: Joi.string().allow(""),
      subscriptionPlan: Joi.string().valid("explorer", "learner").required(),
      explorerTrialEndsAt: Joi.any().optional(),
    });

    const { error, value } = validator.validate(req.body, {
      stripUnknown: true,
    });

    if (error) {
      return next(error);
    }

    const emailTaken = await User.findOne({
      email: value.email,
      _id: { $ne: id },
    });
    if (emailTaken) {
      return next(ErrorHandler.error("email is taken"));
    }

    const updatePayload: Record<string, unknown> = {
      fname: value.fname,
      lname: value.lname,
      username: value.username,
      email: value.email,
      role: value.role,
      status: value.status,
      subscriptionPlan: value.subscriptionPlan,
    };

    if (value.subscriptionPlan === "learner") {
      updatePayload.explorerTrialEndsAt = null;
    } else if (Object.prototype.hasOwnProperty.call(value, "explorerTrialEndsAt")) {
      const raw = value.explorerTrialEndsAt;
      if (raw === null || raw === "") {
        updatePayload.explorerTrialEndsAt = null;
      } else {
        const d = new Date(raw as string | Date);
        if (Number.isNaN(d.getTime())) {
          return next(ErrorHandler.error("Invalid explorer trial end date"));
        }
        updatePayload.explorerTrialEndsAt = d;
      }
    }

    if (value.password && String(value.password).trim().length > 0) {
      if (String(value.password).length < 3) {
        return next(ErrorHandler.error("Password must be at least 3 characters"));
      }
      if (value.password !== value.confirmPassword) {
        return next(ErrorHandler.error("Passwords do not match"));
      }
      updatePayload.password = await bcrypt.hash(value.password, 10);
    }

    try {
      const updateUser = await User.findByIdAndUpdate(id, updatePayload, {
        new: true,
      });

      if (!updateUser) return next(ErrorHandler.error("user not found"));

      return res.status(200).json({
        message: "account update sucessfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(ErrorHandler.error("Id is Not valid"));
    }

    try {
      const data = await User.findByIdAndDelete(id);

      if (!data) {
        return next(ErrorHandler.error("No item found to delete"));
      }

      return res.status(200).json({
        message: "user deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
