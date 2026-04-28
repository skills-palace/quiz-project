import { Request, Response, NextFunction } from "express";
import Media from "../models/media.model";
import ErrorHandler from "../services/ErrorHandler";
import fs from "fs";

const mediaController = {
  async index(req: Request, res: Response, next: NextFunction) {
    const files = await Media.find({}).limit(10);

    return res.status(200).json({
      result: files,
      message: "media fetch successfully",
    });
  },

  async store(req: Request, res: Response, next: NextFunction) {
    // upload(req, res, async (err:any) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   if (!req.file) {
    //     return next(ErrorHandler.notFound("No file found"));
    //   }
    //   const file = new Media({ name: req.file.filename });
    //   try {
    //     await file.save(function (err) {
    //       if (err) {
    //         return next(err);
    //       }
    //       return res
    //         .status(200)
    //         .json({ message: "media created successfully" });
    //     });
    //   } catch (error) {
    //     return next(error);
    //   }
    // });
  },
  async destroy(req: Request, res: Response, next: NextFunction) {
    const isExist = await Media.findOneAndDelete({ name: req.params.name });

    if (!isExist) {
      return next(ErrorHandler.notFound("item not found"));
    }

    //file removed
    fs.unlink(`server/uploads/images/${req.params.name}`, (err: any) => {
      if (err) {
        return next(ErrorHandler.serverError());
      }
    });

    return res.status(200).json({ message: "media deleted successfully" });
  },
};

export default mediaController;
