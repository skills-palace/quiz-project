import { Request, Response, NextFunction } from "express";
import Lesson from "../models/lesson.model";
import LessonLog from "../models/lesson-log.model";
import ErrorHandler from "../services/ErrorHandler";
import quizValidator from "../helper/quiz-validator";
import modifier from "../../src/helper/shuffler";
import fs from "fs";
import path from "path";
import { Types } from "mongoose";
import User from "../models/user.model";
import { hasActiveLearningAccess } from "../utils/subscription";

const hasBrokenImagePath = (imagePath: unknown) => {
  if (typeof imagePath !== "string" || !imagePath.trim()) return false;

  // Uploaded images are stored as relative paths like uploads/123.jpg
  if (imagePath.startsWith("uploads/") || imagePath.startsWith("uploads\\")) {
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const absolutePath = path.resolve(process.cwd(), normalizedPath);
    return !fs.existsSync(absolutePath);
  }

  return false;
};

function shuffleArray(array: any[]) {
  for (let i = array?.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const lessonController = {
  async index(req: Request, res: Response, next: NextFunction) {
    interface IQuery {
      page: string;
      title?: string;
      status?: number;
      limit: string;
      sort?: "asc" | "desc";
    }

    const { page, title, status, limit, sort } = req.query as unknown as IQuery;
    const { _id, role } = req.user;

    interface IFilter {
      author: string;
      title: any;
      status: number;
    }
    const query = <IFilter>{};

    const sortBy: { _id: any } = { _id: -1 };

    if (!(role === 1)) query.author = _id;
    if (title) query.title = { $regex: title, $options: "i" };
    if (status) query.status = status;

    if (sort === "asc") sortBy._id = 1;

    const _page = +page || 1;
    const _limit = +limit || 10;
    const offset = _limit * (_page - 1);

    console.log("_page", _page);

    const total = await Lesson.countDocuments(query);

    try {
      const lessons = await Lesson.find(query)
        .sort(sortBy)
        .skip(offset)
        .limit(_limit)
        .select("-description");
      //  .select(["name", "email"]);

      return res.status(200).json({
        result: lessons,
        page: _page,
        limit: _limit,
        offset,
        total,
        count: lessons.length,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getLessons(req: Request, res: Response, next: NextFunction) {
    interface IQuery {
      page?: number;
      title?: string;
      status?: number;
      limit?: number;
      sort?: "asc" | "desc";
    }

    const { page, title, limit, sort } = req.query as unknown as IQuery;

    interface IFilter {
      author: string;
      title: any;
      status: number;
    }
    const query = <IFilter>{};

    const sortBy: any = { _id: -1 };

    const pageNumber = page || 1;
    const pageSize = limit || 100;

    if (title) query.title = { $regex: title, $options: "i" };
    // Public lessons endpoint should only serve active lessons.
    query.status = 1;

    if (sort) {
      sort === "asc" ? (sortBy._id = 1) : (sortBy._id = -1);
    }

    const offset = pageSize * (pageNumber - 1);

    const total = await Lesson.countDocuments(query);

    try {
      const services = await Lesson.find(query)
        .sort(sortBy)
        .skip(offset)
        .limit(pageSize)
        .populate("skill")
        .select("-description");

      services.forEach((lesson: any) => {
        if (hasBrokenImagePath(lesson?.imagePath)) {
          lesson.imagePath = "";
        }
      });
      //  .select(["name", "email"]);
      return res.status(200).json({
        result: services,
        page: pageNumber,
        limit: pageSize,
        offset,
        total,
        count: services.length,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getLesson(req: Request, res: Response, next: NextFunction) {
    console.log("params bb", req.params.title);
    try {
      const lessonId = req.params.title;
      if (!Types.ObjectId.isValid(lessonId)) {
        return next(ErrorHandler.error("lesson not found"));
      }

      const lesson = await Lesson.findById(lessonId).populate(
        "quizes",
        "-status -createdAt -updatedAt"
      );

      if (!lesson) return next(ErrorHandler.error("lesson not found"));
      if (lesson.status !== 1) {
        return next(ErrorHandler.error("lesson not found"));
      }
      if (hasBrokenImagePath(lesson.imagePath)) {
        lesson.imagePath = "";
      }
      // Normalize: DB legacy / null refs from populate; avoid forEach on null or null quiz entries (500s).
      let quizes = Array.isArray(lesson.quizes)
        ? lesson.quizes.filter((q: any) => q != null)
        : [];
      if (quizes.length > 0) {
        quizes = shuffleArray(quizes);
      }
      lesson.quizes = quizes;

      lesson.quizes.forEach((quiz: any) => {
        if (!quiz) return;
        if (
          quiz.type === "multiple_choice" ||
          quiz.type === "multiple_choice2" ||
          quiz.type === "reorder" ||
          quiz.type === "true_false" ||
          quiz.type === "math" ||
          (quiz.type === "rearrange" && quiz.quizes) ||
          (quiz.type === "word_bank" && quiz.quizes)
        ) {
          if (Array.isArray(quiz.quizes) && quiz.quizes.length > 0) {
            quiz.quizes = shuffleArray(quiz.quizes);
          }
        } else if (quiz.type === "line_connect") {
          if (Array.isArray(quiz.quizes) && quiz.quizes[0]) {
            if (Array.isArray(quiz.quizes[0].left)) {
              quiz.quizes[0].left = shuffleArray(quiz.quizes[0].left);
            }
            if (Array.isArray(quiz.quizes[0].right)) {
              quiz.quizes[0].right = shuffleArray(quiz.quizes[0].right);
            }
          }
        } else if (quiz.type === "missing_word") {
          if (Array.isArray(quiz?.meta?.root)) {
            quiz.meta.root = shuffleArray(quiz.meta.root);
          }
        } else if (
          quiz.type === "group_sort" ||
          quiz.type === "classification"
        ) {
          if (Array.isArray(quiz?.quizes) && quiz.quizes[0]?.root?.items) {
            if (Array.isArray(quiz.quizes[0].root.items)) {
              quiz.quizes[0].root.items = shuffleArray(quiz.quizes[0].root.items);
            }
          }
        }
      });

      return res.status(200).json({
        result: lesson,
      });
    } catch (error) {
      return next(error);
    }
  },
  async showForEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await Lesson.findById(req.params.id).populate("quizes skill");

      if (!doc) return next(ErrorHandler.error("lesson not found"));

      return res.status(200).json({
        result: doc,
      });
    } catch (error) {
      return next(error);
    }
  },

  async validateQuiz(req: Request, res: Response, next: NextFunction) {
    console.log("validate call");
    const { id, answers, spend_time } = req.body;
    try {
      const jwtUser = req.user as { _id: string; role: number };
      if (jwtUser.role !== 1) {
        const account = await User.findById(jwtUser._id).lean();
        if (!account || !hasActiveLearningAccess(account)) {
          return next(
            ErrorHandler.error(
              "Your Explorer trial has ended. Upgrade to submit quiz results and save progress.",
              403
            )
          );
        }
      }

      const lesson = await Lesson.findById(id).populate(
        "quizes",
        "-quizes -status -createdAt -updatedAt"
      );

      if (!lesson) return next("no lessson found");

      //const validateAns = [];

      // console.log("lesson", lesson);

      // console.log("lesson", lesson);
      let totalObtainMark = 0;
      let totalMark = 0;

      const validateAnswers = lesson.quizes.map((quiz: any) => {
        //totalMark += quiz.total_mark;
        const userAnswer = answers.find((ele: any) => ele.id == quiz.id);

        const { quiz_items, mark, obtainMark, review }: any = quizValidator(
          quiz.type,
          quiz.raw,
          userAnswer?.answers,
          {
            alternativeSequences: quiz.alternativeSequences,
          }
        );
        console.log("mrk", mark);
        // console.log(quiz.title, mark, obtainMark);
        totalMark += mark;
        totalObtainMark += obtainMark;
        return {
          title: quiz.title,
          type: quiz.type,
          mark: mark || 0,
          obtain_mark: obtainMark || 0,
          quiz_items,
          ...(review != null && typeof review === "object" ? { review } : {}),
        };
      });

      // return res.json("ok");

      console.log("totalObtainMark", totalObtainMark);
      console.log("totalMark", totalMark);

      const lessonLog = await LessonLog.create({
        title: lesson.title,
        lesson: lesson._id,
        answers: answers,
        learner: req.user._id,
        subject: lesson.subject,
        grade: lesson.grade,
        time: lesson.time,
        spend_time: `${spend_time.min}:${spend_time.sec}`,
        total_mark: totalMark,
        obtain_mark: totalObtainMark,
        quizes: validateAnswers,
      });
      return res.status(200).json({
        result: lessonLog,
        message: "lesson log success",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },

  async getLessonLog(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonLog = await LessonLog.findById(req.params.id);
      if (!lessonLog) return next(ErrorHandler.error("lesson log not found"));

      return res.status(200).json({
        result: lessonLog,
        message: "data fetch successsfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async getMyLessonLog(req: Request, res: Response, next: NextFunction) {
    console.log("id: ", req.user._id);
    try {
      const lessonLog = await LessonLog.find({ learner: req.user._id }).sort({
        createdAt: -1,
      });
      if (!lessonLog) return next(ErrorHandler.error("lesson log not found"));

      return res.status(200).json({
        result: lessonLog,
        message: "data fetch successsfully",
      });
    } catch (error) {
      return next(error);
    }
  },
  async cleanupBrokenImages(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await Lesson.find({
        imagePath: { $exists: true, $nin: [null, ""] },
      }).select("_id imagePath");

      const brokenImageLessonIds = lessons
        .filter((lesson: any) => hasBrokenImagePath(lesson.imagePath))
        .map((lesson: any) => lesson._id);

      if (brokenImageLessonIds.length > 0) {
        await Lesson.updateMany(
          { _id: { $in: brokenImageLessonIds } },
          { $set: { imagePath: "" } }
        );
      }

      return res.status(200).json({
        message: "Broken lesson images cleanup completed",
        inspected: lessons.length,
        cleaned: brokenImageLessonIds.length,
        cleanedLessonIds: brokenImageLessonIds,
      });
    } catch (error) {
      return next(error);
    }
  },
  async store(req: Request, res: Response, next: NextFunction) {
    console.log("here is the updated");
    const {
      title,
      time,
      subject,
      grade,
      description,
      total_mark,
      skill,
      quizIds,
      status,
      hideParagraphSide,
    } = req.body;
    const { _id } = req.user;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const audioPath = files.audioPath ? files.audioPath[0].path : null;
    const imagePath = files.imagePath ? files.imagePath[0].path : null;
    try {
      const ls = await Lesson.create({
        title,
        time,
        description,
        subject,
        grade,
        total_mark,
        author: _id,
        quizes: quizIds,
        status,
        hideParagraphSide:
          hideParagraphSide == null || hideParagraphSide === ""
            ? 1
            : Number(hideParagraphSide),
        skill,
        audioPath,
        imagePath,
      });
      return res
        .status(200)
        .json({ message: "Lesson created successfully", data: ls });
    } catch (error) {
      return next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const {
      title,
      time,
      subject,
      grade,
      description,
      total_mark,
      quizIds,
      skill,
      status,
      hideParagraphSide,
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    let audioPath = files?.audioPath ? files.audioPath[0].path : null;
    let imagePath = files?.imagePath ? files.imagePath[0].path : null;

    if (audioPath == undefined) {
      audioPath = req.body.audioPath;
    }
    if (imagePath == undefined) {
      imagePath = req.body.imagePath;
    }
    try {
      const doc = await Lesson.findByIdAndUpdate(id, {
        title,
        time,
        description,
        subject,
        skill,
        grade,
        total_mark,
        quizes: quizIds,
        status,
        hideParagraphSide: Number(hideParagraphSide ?? 0),
        audioPath,
        imagePath,
      });
      if (!doc) return next(ErrorHandler.error("quiz not found"));

      return res
        .status(200)
        .json({ message: "quiz update successfully", val: doc });
    } catch (error) {
      return next(error);
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    const document = await Lesson.findOne({ id: req.params.slug });

    if (!document) {
      return next(ErrorHandler.notFound("No item Found"));
    }

    res.json({
      data: document,
    });
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await Lesson.findByIdAndDelete(req.params.id);

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

export default lessonController;
