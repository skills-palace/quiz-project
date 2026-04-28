import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import ErrorHandler from "../services/ErrorHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import config from "config";
import { getExplorerTrialEndIso } from "../utils/subscription";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function authUserPayload(user: {
  _id?: unknown;
  fname: string;
  role: number;
  phone: number;
  email: string;
  subscriptionPlan?: string;
  explorerTrialEndsAt?: Date | null;
  createdAt?: Date;
}) {
  return {
    _id: user._id,
    fname: user.fname,
    role: user.role,
    phone: user.phone,
    email: user.email,
    subscriptionPlan: user.subscriptionPlan ?? "explorer",
    explorerTrialEndsAt: getExplorerTrialEndIso(user),
  };
}

const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const loginSchema = Joi.object({
      email: Joi.string().required().max(80),
      password: Joi.string().required().max(80),
    });

    const { error } = loginSchema.validate({ email, password });

    if (error) {
      return next(error);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(ErrorHandler.notFound("user not found"));
    }
    if (!user.status) {
      return next(ErrorHandler.error("Your account is not active"));
    }

    //compare user password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return next(ErrorHandler.error("password or email not match"));
    }

    const accessToken = user.jwtToken();
    const refreshToken = user.jwtRefreshToken();

    user.save((error) => {
      if (error) {
        return next(error);
      }
    });

    if (req.query["set-cookie"]) {
      // res.cookie("refresh_token", refreshToken, {
      //   maxAge: 1000 * 60 * 60 * 24 * 365,
      //   httpOnly: true,
      // });
      // res.cookie("access_token", accessToken, {
      //   maxAge: 1000 * 60 * 60 * 24,
      //   httpOnly: true,
      // });
    }

    const userInfo = authUserPayload(user);

    return res.status(200).json({
      result: userInfo,
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: "login success",
    });
  },
  async googleLogin(req: Request, res: Response) {
    try {
      const { email, googleId, fname, lname } = req.body;
      console.log(req.body);
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          email,
          fname,
          lname,
          googleId,
          status: 1, // Active status
          subscriptionPlan: "explorer",
          explorerTrialEndsAt: new Date(Date.now() + WEEK_MS),
        });
        await user.save();
      } else if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      const accessToken = user.jwtToken();
      const refreshToken = user.jwtRefreshToken();

      // const accessToken = jwt.sign({ _id: user._id, role: user.role }, SECRET, {
      //   expiresIn: "60s",
      // });
      // const refreshToken = jwt.sign({ _id: user._id }, REFRESH_SECRET, {
      //   expiresIn: "1y",
      // });

      return res.status(200).json({
        result: authUserPayload(user),
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Login success",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async facebookLogin(req: Request, res: Response) {
    try {
      const { email, facebookId, fname, lname } = req.body;
      console.log(req.body);
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          email,
          fname,
          lname,
          facebookId,
          status: 1, // Active status
          subscriptionPlan: "explorer",
          explorerTrialEndsAt: new Date(Date.now() + WEEK_MS),
        });
        await user.save();
      } else if (!user.facebookId) {
        user.facebookId = facebookId;
        await user.save();
      }

      const accessToken = user.jwtToken();
      const refreshToken = user.jwtRefreshToken();

      // const accessToken = jwt.sign({ _id: user._id, role: user.role }, SECRET, {
      //   expiresIn: "60s",
      // });
      // const refreshToken = jwt.sign({ _id: user._id }, REFRESH_SECRET, {
      //   expiresIn: "1y",
      // });

      return res.status(200).json({
        result: authUserPayload(user),
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Login success",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).json({
      message: "log out success",
    });
  },

  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const registerSchema = Joi.object({
      fname: Joi.string().max(20).required().label("first name"),
      lname: Joi.string().max(20).required().label("last name"),
      username: Joi.string().max(40).required().label("user name"),
      email: Joi.string().max(80).required(),
      //.custom((v) => v.toLowerString()),
      phone: Joi.string(),
      role: Joi.number().default(2).valid(2, 3, 4),
      password: Joi.string().required().max(80),
      confirm_password: Joi.string().required().valid(Joi.ref("password")),
    });

    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //check if user in DB
    const isExist = await User.findOne({ email });

    if (isExist) {
      return next(ErrorHandler.error("email is already exist"));
    }

    //  has password
    const hashPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        ...value,
        password: hashPassword,
        subscriptionPlan: "explorer",
        explorerTrialEndsAt: new Date(Date.now() + WEEK_MS),
      });

      const accessToken = user.jwtToken();
      const refreshToken = user.jwtRefreshToken();

      user.save((err) => {
        if (err) return next(err);
      });
      const userInfo = authUserPayload(user);

      return res.status(200).json({
        result: userInfo,
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Registation Successfull",
      });
    } catch (error) {
      return next(error);
    }
  },
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(ErrorHandler.unAuthorize("Token not found"));
    }

    const refreshToken = authHeader.split(" ")[1];

    try {
      const { _id }: any = jwt.verify(
        refreshToken,
        config.get<string>("JWT.REFRESH_SECRET")
      );

      const user = await User.findById(_id).select("+refreshToken");

      if (!user) {
        return next(ErrorHandler.unAuthorize("Token is not valid"));
      }

      if (user.status !== 1) {
        return next(ErrorHandler.error("Your account is not active"));
      }

      const accessToken = user.jwtToken();

      return res.status(200).json({
        accessToken,
        message: "Access token generated successfully",
      });
    } catch (error) {
      return next(ErrorHandler.unAuthorize("Token validation failed"));
    }
  },
};

export default authController;
