import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const optionController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const userCount = await User.aggregate([
        {
          $group: {
            _id: "$role",
            total: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json({
        result: userCount,
        message: "user count",
      });
    } catch (error) {
      return next(error);
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {},
  async update(req: Request, res: Response, next: NextFunction) {},
  async destroy(req: Request, res: Response, next: NextFunction) {},
};

export default optionController;
