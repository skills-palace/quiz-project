import { Request, Response, NextFunction } from "express";
import Quiz from "../models/quiz.model";
import ErrorHandler from "../services/ErrorHandler";
import quizModifier from "../helper/quizModifier";
import quizSchema from "../schema/quiz.schema";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { formatQuizData } from "../utils/formatQuizData";
import { generateUniqueId } from "../utils/generateId";
import { generateMultipleChoice } from "../utils/generateMultipleChoice";
import { generateTrueFalse } from "../utils/generateTrueFalse";
import { generateMath } from "../utils/generateMath";
import { generateRearrange } from "../utils/generateRearrange";
import { generateMissingWord } from "../utils/generateMissingWord";
import { generateBlankSpace } from "../utils/generateBlankSpace";
import { generateHighlightWord } from "../utils/generateHighlightWord";
import { generateGroupSort } from "../utils/generateGroupSort";
import { generateClassification } from "../utils/generateClassification";
import { generateLineConnecting } from "../utils/generateLineConnecting";
import { generateReorderQuestions } from "../utils/generateReorderQuestions";
import { ALLOWED_QUIZ_LIST_TYPES } from "../constants/quiz-types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});
const quizController = {
  async index(req: Request, res: Response, next: NextFunction) {
    interface IQuery {
      page: string;
      title?: string;
      status?: number;
      limit: string;
      sort?: "asc" | "desc";
      type?: string;
    }
    const { page, title, status, limit, sort, type } = req.query as unknown as IQuery;
    const { _id, role } = req.user;

    interface IFilter {
      author?: string;
      title?: any;
      status?: number;
      type?: string;
    }
    const query: IFilter = {};

    const sortBy: { _id: any } = { _id: -1 };

    if (!(role == 1)) query.author = _id as any;
    if (title) query.title = { $regex: title, $options: "i" };
    if (status) query.status = status;
    const typeTrim =
      typeof type === "string" ? type.trim() : "";
    if (
      typeTrim &&
      ALLOWED_QUIZ_LIST_TYPES.includes(typeTrim)
    ) {
      query.type = typeTrim;
    }

    if (sort === "asc") sortBy._id = 1;

    const _page = +page || 1;
    const _limit = +limit || 20;
    const offset = _limit * (_page - 1);

    const total = await Quiz.countDocuments(query);

    try {
      const quizes = await Quiz.find(query)
        .sort(sortBy)
        .skip(offset)
        .limit(_limit);
      //  .select(["name", "email"]);

      return res.status(200).json({
        result: quizes,
        page: _page,
        limit: _limit,
        offset,
        total,
        count: quizes.length,
      });
    } catch (error) {
      return next(error);
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.user;
    console.log("bodyData", req.body);
    const { error, value } = quizSchema.validate(req.body);
    // console.log('value', value);
    if (error) return next(error);
    const { quizes } = value;

    const groupTotalmark = () => {
      return quizes.reduce((acc: any, ele: any) => {
        ele.items.forEach((item: any) => (acc += item.mark));
        return acc;
      }, 0);
    };

    const normalTotalMark = () => {
      return quizes.reduce((acc: any, ele: any) => (acc += ele.mark), 0);
    };

    const totalMark =
      value.type === "group_sort" || value.type === "classification"
        ? groupTotalmark()
        : normalTotalMark();

    console.log("totalMark", totalMark);
    //console.log("quizModifier", quizModifier(value.type, quizes));

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const audioPath =
      files?.["audioPath"] && files["audioPath"].length > 0
        ? files["audioPath"][0].path
        : null;

    const questionAudio =
      files?.["questionAudio"] && files["questionAudio"].length > 0
        ? files["questionAudio"][0].path
        : null;

    try {
      const created = await Quiz.create({
        ...value,
        total_mark: totalMark,
        author: _id,
        raw: quizes,
        audioPath: audioPath,
        questionAudio: questionAudio,
        ...quizModifier(value.type, [...quizes]),
      });
      return res
        .status(200)
        .json({ message: "quiz created successfully", quiz: created });
    } catch (error) {
      console.log("error:", error);
      return next(error);
    }
    // return res.status(404).json({ message: "quiz created successfully" });
    //return res.status(200).json({ message: "quiz created successfully" });
  },

  async generateStore(req: Request, res: Response, next: NextFunction) {
    // console.log(req.user);
    const { _id } = req.user;
    // const _id = '674c164af2cba8a993084d82';
    console.log("Body", req.body);

    const { error, value } = quizSchema.validate(req.body);
    // console.log('value', value);
    if (error) return next(error);
    const { quizes } = value;

    const groupTotalmark = () => {
      return quizes.reduce((acc: any, ele: any) => {
        ele.items.forEach((item: any) => (acc += item.mark));
        return acc;
      }, 0);
    };

    const normalTotalMark = () => {
      return quizes.reduce((acc: any, ele: any) => (acc += ele.mark), 0);
    };

    const totalMark =
      value.type === "group_sort" || value.type === "classification"
        ? groupTotalmark()
        : normalTotalMark();

    console.log("totalMark", totalMark);
    //console.log("quizModifier", quizModifier(value.type, quizes));

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const audioPath =
      files?.["audioPath"] && files["audioPath"].length > 0
        ? files["audioPath"][0].path
        : null;

    const questionAudio =
      files?.["questionAudio"] && files["questionAudio"].length > 0
        ? files["questionAudio"][0].path
        : null;

    try {
      await Quiz.create({
        ...value,
        total_mark: totalMark,
        author: _id,
        raw: quizes,
        audioPath: audioPath,
        questionAudio: questionAudio,
        ...quizModifier(value.type, [...quizes]),
      });
      console.log("quiz created successfully");
    } catch (error) {
      console.log("error:", error);
      return next(error);
    }
    // return res.status(404).json({ message: "quiz created successfully" });
    //return res.status(200).json({ message: "quiz created successfully" });
  },
  async show(req: Request, res: Response, next: NextFunction) {
    const doc = await Quiz.findOne({ slug: req.params.slug });

    if (!doc) {
      return next(ErrorHandler.notFound("No item Found"));
    }

    res.json({
      data: doc,
    });
  },
  async getOne(req: Request, res: Response, next: NextFunction) {
    const doc = await Quiz.findById(req.params.id);
    if (!doc) {
      return next(ErrorHandler.notFound("No item Found"));
    }

    res.json({
      data: doc,
    });
  },
  async edit(req: Request, res: Response, next: NextFunction) {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return next(ErrorHandler.notFound("quiz not found"));

    res.json({
      result: quiz,
    });
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    console.log("req.body", req.body);
    const { error, value } = quizSchema.validate(req.body);

    if (error) return next(error);
    const { quizes } = value;

    const groupTotalmark = () => {
      return quizes.reduce((acc: any, ele: any) => {
        ele.items.forEach((item: any) => (acc += item.mark));
        return acc;
      }, 0);
    };

    const normalTotalMark = () => {
      return quizes.reduce((acc: any, ele: any) => (acc += ele.mark), 0);
    };

    const totalMark =
      value.type === "group_sort" || value.type === "classification"
        ? groupTotalmark()
        : normalTotalMark();

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let audioPath = files["audioPath"] ? files["audioPath"][0].path : undefined;
    if (audioPath == undefined) {
      audioPath = req.body.audioPath;
    }

    let questionAudio = files["questionAudio"]
      ? files["questionAudio"][0].path
      : undefined;
    if (questionAudio == undefined) {
      questionAudio = req.body.questionAudio;
    }
    console.log(questionAudio);
    try {
      const doc = await Quiz.findByIdAndUpdate(id, {
        ...value,
        total_mark: totalMark,
        raw: quizes,
        audioPath,
        questionAudio,
        ...quizModifier(value.type, [...quizes]),
      });
      if (!doc) return next(ErrorHandler.error("quiz not found"));

      return res.status(200).json({ message: "quiz update successfully" });
    } catch (error) {
      return next(error);
    }
  },

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await Quiz.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(ErrorHandler.notFound("No data found to delete"));
      }
      return res.status(200).json({
        message: "quiz deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async generateQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      let { language, content, questionConfig, maxQuestionsType } = req.body;

      // Handle file upload for content
      if (req.file) {
        const filePath = path.resolve(req.file.path);
        content = fs.readFileSync(filePath, "utf-8");
      }

      // Validate incoming data
      if (
        !language ||
        !content ||
        !Array.isArray(questionConfig) ||
        !maxQuestionsType
      ) {
        return res.status(400).json({
          error:
            "Invalid input. Please provide language, content (or content file), questionConfig, and maxQuestions.",
        });
      }

      let totalQuestions = 0;

      // Initialize an array to collect all promises
      const allQuestionTasks: Promise<void>[] = [];

      // Process each question type in the configuration
      for (const config of questionConfig) {
        const { type, limit } = config;

        // Ensure the total question limit is not exceeded
        // if (totalQuestions >= maxQuestions) break;

        // Adjust the limit if it exceeds remaining allowed questions
        const adjustedLimit = limit;

        // Call the appropriate utility based on the question type
        switch (type.toLowerCase()) {
          case "multiple_choice":
            allQuestionTasks.push(
              generateMultipleChoice(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "true_false":
            allQuestionTasks.push(
              generateTrueFalse(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "math":
            allQuestionTasks.push(
              generateMath(req, res, next, content, language, adjustedLimit)
            );
            break;
          case "rearrange":
            allQuestionTasks.push(
              generateRearrange(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "missing_word":
            allQuestionTasks.push(
              generateMissingWord(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "blank_space":
            allQuestionTasks.push(
              generateBlankSpace(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "highlight_word":
            allQuestionTasks.push(
              generateHighlightWord(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "group_sort":
            allQuestionTasks.push(
              generateGroupSort(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "classification":
            allQuestionTasks.push(
              generateClassification(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "line_connect":
            allQuestionTasks.push(
              generateLineConnecting(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          case "reorder":
            allQuestionTasks.push(
              generateReorderQuestions(
                req,
                res,
                next,
                content,
                language,
                adjustedLimit
              )
            );
            break;
          default:
            return res
              .status(400)
              .json({ error: `Unsupported question type: ${type}` });
        }

        totalQuestions += adjustedLimit;
      }

      // Wait for all question generation tasks to complete
      await Promise.all(allQuestionTasks);

      // Send a single success response after all tasks are done
      return res.status(200).json({
        message: "Quiz created successfully",
        totalQuestions,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default quizController;
