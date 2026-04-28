import { Request, Response, NextFunction } from "express";
import LearnGroup from "../models/learn-group.model";
import ErrorHandler from "../services/ErrorHandler";

const learnGroupController = {
  async index(req: Request, res: Response, next: NextFunction) {
    interface IQuery {
      title: string;
      page: number;
      limit: number;
      status: number;
    }

    const { page, title, status, limit } = req.query as unknown as IQuery;
    const _id = req.user._id;
    const role = req.user.role;
    if (!_id || !role) {
      return next(ErrorHandler.unAuthorize("Token not found"));
    }
    interface IFilter {
      author: string;
      title: any;
      status: number;
    }

    const query = <IFilter>{};

    if (!(role === 1)) query.author = _id;
    if (title) query.title = { $regex: title, $options: "i" };
    if (status) query.status = status;

    const _page = +page || 1;
    const _limit = +limit || 10;
    const offset = _limit * (_page - 1);

    const total = await LearnGroup.countDocuments(query);

    try {
      const learnGroups = await LearnGroup.find(query)
        .skip(offset)
        .limit(_limit)
        .sort({ $natural: -1 })
        .populate("students");
      //  .select(["name", "email"]);

      return res.status(200).json({
        result: learnGroups,
        page: _page,
        limit: _limit,
        total,
        count: learnGroups.length,
      });
    } catch (error) {
      return next(error);
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
    const { name, student_ids, description } = req.body;
    // const { _id } = req.user;
    const _id = req?.user?._id;
    const role = req.user.role;
    if (!_id || !role) {
      return next(ErrorHandler.unAuthorize("Token not found"));
    }
    try {
      await LearnGroup.create({
        name: name,
        students: student_ids,
        total_student: student_ids.length,
        author: _id,
        description,
      });
      return res.status(200).json({ message: "group created successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    const { name, student_ids, description } = req.body;
    const id = req.params.id;
    const _id = req?.user?._id;
    const role = req.user.role;
    console.log("i am here to update");

    if (!_id || !role) {
      return next(ErrorHandler.unAuthorize("Token not found"));
    }

    try {
      const group = await LearnGroup.findById(id);

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Update the group fields
      group.name = name;
      group.students = student_ids;
      group.total_student = student_ids.length;
      group.author = _id;
      group.description = description;

      await group.save();

      return res.status(200).json({ message: "Group updated successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await LearnGroup.findByIdAndDelete(req.params.id);

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

export default learnGroupController;
