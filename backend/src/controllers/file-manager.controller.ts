import { Request, Response, NextFunction } from "express";
import Media from "../models/media.model";
import ErrorHandler from "../services/ErrorHandler";
import fs from "fs";

const fileManagerController = {
  async index(req: Request, res: Response, next: NextFunction) {
    const { _id, role } = req.user;

    interface IQuery {
      page: number;
      title: string;
      status: number;
      limit: number;
    }
    const { page, title, status, limit } = req.query as unknown as IQuery;

    const q: any = {};
    if (role == 3) {
      q.type = 2;
      q.author = _id;
    } else {
      if (status) q.status = status;
    }
    if (title) q.name = { $regex: title, $options: "i" };

    const pageNumber = +page || 1;
    const pageSize = +limit || 30;
    const offset = pageSize * (pageNumber - 1);

    const total = await Media.countDocuments(q);

    try {
      const result = await Media.find(q)
        .sort({ _id: -1 })
        .skip(offset)
        .limit(pageSize);

      return res.status(200).json({
        result,
        page: pageNumber,
        limit: pageSize,
        offset,
        total,
        count: result.length,
        message: "media fetch successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
    const { _id, role } = req.user;

    // if (req.fileError) {
    //   return next(ErrorHandler.error(req.fileError));
    // }

    console.log("req.file", req.file);

    if (!req.file) {
      return next(ErrorHandler.error("file not found"));
    }

    try {
      await Media.create({
        name: req.file.filename,
        author: _id,
        ...(role === 3 && { type: 2 }),
      });
      return res.status(200).json({ message: "media created successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async destroy(req: Request, res: Response, next: NextFunction) {
    const file = req.params.file;

    const files = file.split(",");

    try {
      await Media.deleteMany({
        name: { $in: files },
      });
      files.map((name: string) => {
        fs.unlinkSync(`src/public/image/${name}`);
      });
    } catch (error) {}

    return res.status(200).json({ message: "media deleted successfully" });
  },
};

export default fileManagerController;
