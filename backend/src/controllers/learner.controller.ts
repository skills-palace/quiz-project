import { Request, Response, NextFunction } from "express";
import Learner from "../models/learner.model";
import ErrorHandler from "../services/ErrorHandler";

const learnerController = {
  async index(req: Request, res: Response, next: NextFunction) {
    interface IQuery {
      page: number;
      title: string;
      status: number;
      limit: number;
    }
  
    const { page, title, status, limit } = req.query as unknown as IQuery;
  
    const { _id, role } = req.user;
  
    interface IFilter {
      author?: string;
      title?: any;
      status?: number;
    }
  
    const query = <IFilter>{};
  
    if (role !== 1) query.author = _id;
  
    if (title) query.title = { $regex: title, $options: "i" };
    if (status) query.status = status;
  
    const _page = +page || 1;
    const _limit = +limit || 10;
    const offset = _limit * (_page - 1);
  
    const total = await Learner.countDocuments(query);
  
    try {
      const learners = await Learner.find(query)
        .skip(offset)
        .limit(_limit) // Use _limit here
        .sort({ _id: -1 })
        .populate("student", "fname");
  
      return res.status(200).json({
        result: learners,
        page: _page,
        limit: _limit,
        total,
        count: learners.length,
      });
    } catch (error) {
      return next(error);
    }
  }
  ,

  async store(req: Request, res: Response, next: NextFunction) {
    const { student, code, grade } = req.body;
    const { _id } = req.user;

    try {
      const isStudentfound = await Learner.findOne({ author: _id, student });

      if (isStudentfound) {
        return next(ErrorHandler.error("this student alreay in your list"));
      }

      await Learner.create({
        student,
        author: _id,
        code,
        grade,
      });
      return res.status(200).json({ message: "student created successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.user;
    const { student, code, grade } = req.body;
    const { id } = req.params;

    try {
      await Learner.findByIdAndUpdate(id, {
        student,
        code,
        grade,
      });
      return res.status(200).json({ message: "student update successfully" });
    } catch (error) {
      return next(error);
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await Learner.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(ErrorHandler.notFound("No data found to delete"));
      }
      return res.status(200).json({
        message: "lesson deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default learnerController;
