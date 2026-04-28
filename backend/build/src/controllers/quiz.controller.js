"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const quizModifier_1 = __importDefault(require("../helper/quizModifier"));
const quiz_schema_1 = __importDefault(require("../schema/quiz.schema"));
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateMultipleChoice_1 = require("../utils/generateMultipleChoice");
const generateTrueFalse_1 = require("../utils/generateTrueFalse");
const generateMath_1 = require("../utils/generateMath");
const generateRearrange_1 = require("../utils/generateRearrange");
const generateMissingWord_1 = require("../utils/generateMissingWord");
const generateBlankSpace_1 = require("../utils/generateBlankSpace");
const generateHighlightWord_1 = require("../utils/generateHighlightWord");
const generateGroupSort_1 = require("../utils/generateGroupSort");
const generateClassification_1 = require("../utils/generateClassification");
const generateLineConnecting_1 = require("../utils/generateLineConnecting");
const generateReorderQuestions_1 = require("../utils/generateReorderQuestions");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || "",
});
const quizController = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, title, status, limit, sort } = req.query;
            const { _id, role } = req.user;
            const query = {};
            const sortBy = { _id: -1 };
            if (!(role == 1))
                query.author = _id;
            if (title)
                query.title = { $regex: title, $options: "i" };
            if (status)
                query.status = status;
            if (sort === "asc")
                sortBy._id = 1;
            const _page = +page || 1;
            const _limit = +limit || 20;
            const offset = _limit * (_page - 1);
            const total = yield quiz_model_1.default.countDocuments(query);
            try {
                const quizes = yield quiz_model_1.default.find(query)
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
            }
            catch (error) {
                return next(error);
            }
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.user;
            console.log("bodyData", req.body);
            const { error, value } = quiz_schema_1.default.validate(req.body);
            // console.log('value', value);
            if (error)
                return next(error);
            const { quizes } = value;
            const groupTotalmark = () => {
                return quizes.reduce((acc, ele) => {
                    ele.items.forEach((item) => (acc += item.mark));
                    return acc;
                }, 0);
            };
            const normalTotalMark = () => {
                return quizes.reduce((acc, ele) => (acc += ele.mark), 0);
            };
            const totalMark = value.type === "group_sort" || value.type === "classification"
                ? groupTotalmark()
                : normalTotalMark();
            console.log("totalMark", totalMark);
            //console.log("quizModifier", quizModifier(value.type, quizes));
            const files = req.files;
            const audioPath = (files === null || files === void 0 ? void 0 : files["audioPath"]) && files["audioPath"].length > 0
                ? files["audioPath"][0].path
                : null;
            const questionAudio = (files === null || files === void 0 ? void 0 : files["questionAudio"]) && files["questionAudio"].length > 0
                ? files["questionAudio"][0].path
                : null;
            try {
                const created = yield quiz_model_1.default.create(Object.assign(Object.assign(Object.assign({}, value), { total_mark: totalMark, author: _id, raw: quizes, audioPath: audioPath, questionAudio: questionAudio }), (0, quizModifier_1.default)(value.type, [...quizes])));
                return res
                    .status(200)
                    .json({ message: "quiz created successfully", quiz: created });
            }
            catch (error) {
                console.log("error:", error);
                return next(error);
            }
            // return res.status(404).json({ message: "quiz created successfully" });
            //return res.status(200).json({ message: "quiz created successfully" });
        });
    },
    generateStore(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.user);
            const { _id } = req.user;
            // const _id = '674c164af2cba8a993084d82';
            console.log("Body", req.body);
            const { error, value } = quiz_schema_1.default.validate(req.body);
            // console.log('value', value);
            if (error)
                return next(error);
            const { quizes } = value;
            const groupTotalmark = () => {
                return quizes.reduce((acc, ele) => {
                    ele.items.forEach((item) => (acc += item.mark));
                    return acc;
                }, 0);
            };
            const normalTotalMark = () => {
                return quizes.reduce((acc, ele) => (acc += ele.mark), 0);
            };
            const totalMark = value.type === "group_sort" || value.type === "classification"
                ? groupTotalmark()
                : normalTotalMark();
            console.log("totalMark", totalMark);
            //console.log("quizModifier", quizModifier(value.type, quizes));
            const files = req.files;
            const audioPath = (files === null || files === void 0 ? void 0 : files["audioPath"]) && files["audioPath"].length > 0
                ? files["audioPath"][0].path
                : null;
            const questionAudio = (files === null || files === void 0 ? void 0 : files["questionAudio"]) && files["questionAudio"].length > 0
                ? files["questionAudio"][0].path
                : null;
            try {
                yield quiz_model_1.default.create(Object.assign(Object.assign(Object.assign({}, value), { total_mark: totalMark, author: _id, raw: quizes, audioPath: audioPath, questionAudio: questionAudio }), (0, quizModifier_1.default)(value.type, [...quizes])));
                console.log("quiz created successfully");
            }
            catch (error) {
                console.log("error:", error);
                return next(error);
            }
            // return res.status(404).json({ message: "quiz created successfully" });
            //return res.status(200).json({ message: "quiz created successfully" });
        });
    },
    show(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield quiz_model_1.default.findOne({ slug: req.params.slug });
            if (!doc) {
                return next(ErrorHandler_1.default.notFound("No item Found"));
            }
            res.json({
                data: doc,
            });
        });
    },
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield quiz_model_1.default.findById(req.params.id);
            if (!doc) {
                return next(ErrorHandler_1.default.notFound("No item Found"));
            }
            res.json({
                data: doc,
            });
        });
    },
    edit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield quiz_model_1.default.findById(req.params.id);
            if (!quiz)
                return next(ErrorHandler_1.default.notFound("quiz not found"));
            res.json({
                result: quiz,
            });
        });
    },
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log("req.body", req.body);
            const { error, value } = quiz_schema_1.default.validate(req.body);
            if (error)
                return next(error);
            const { quizes } = value;
            const groupTotalmark = () => {
                return quizes.reduce((acc, ele) => {
                    ele.items.forEach((item) => (acc += item.mark));
                    return acc;
                }, 0);
            };
            const normalTotalMark = () => {
                return quizes.reduce((acc, ele) => (acc += ele.mark), 0);
            };
            const totalMark = value.type === "group_sort" || value.type === "classification"
                ? groupTotalmark()
                : normalTotalMark();
            const files = req.files;
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
                const doc = yield quiz_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign(Object.assign({}, value), { total_mark: totalMark, raw: quizes, audioPath,
                    questionAudio }), (0, quizModifier_1.default)(value.type, [...quizes])));
                if (!doc)
                    return next(ErrorHandler_1.default.error("quiz not found"));
                return res.status(200).json({ message: "quiz update successfully" });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield quiz_model_1.default.findByIdAndDelete(req.params.id);
                if (!doc) {
                    return next(ErrorHandler_1.default.notFound("No data found to delete"));
                }
                return res.status(200).json({
                    message: "quiz deleted successfully",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    generateQuiz(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { language, content, questionConfig, maxQuestionsType } = req.body;
                // Handle file upload for content
                if (req.file) {
                    const filePath = path_1.default.resolve(req.file.path);
                    content = fs_1.default.readFileSync(filePath, "utf-8");
                }
                // Validate incoming data
                if (!language ||
                    !content ||
                    !Array.isArray(questionConfig) ||
                    !maxQuestionsType) {
                    return res.status(400).json({
                        error: "Invalid input. Please provide language, content (or content file), questionConfig, and maxQuestions.",
                    });
                }
                let totalQuestions = 0;
                // Initialize an array to collect all promises
                const allQuestionTasks = [];
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
                            allQuestionTasks.push((0, generateMultipleChoice_1.generateMultipleChoice)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "true_false":
                            allQuestionTasks.push((0, generateTrueFalse_1.generateTrueFalse)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "math":
                            allQuestionTasks.push((0, generateMath_1.generateMath)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "rearrange":
                            allQuestionTasks.push((0, generateRearrange_1.generateRearrange)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "missing_word":
                            allQuestionTasks.push((0, generateMissingWord_1.generateMissingWord)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "blank_space":
                            allQuestionTasks.push((0, generateBlankSpace_1.generateBlankSpace)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "highlight_word":
                            allQuestionTasks.push((0, generateHighlightWord_1.generateHighlightWord)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "group_sort":
                            allQuestionTasks.push((0, generateGroupSort_1.generateGroupSort)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "classification":
                            allQuestionTasks.push((0, generateClassification_1.generateClassification)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "line_connect":
                            allQuestionTasks.push((0, generateLineConnecting_1.generateLineConnecting)(req, res, next, content, language, adjustedLimit));
                            break;
                        case "reorder":
                            allQuestionTasks.push((0, generateReorderQuestions_1.generateReorderQuestions)(req, res, next, content, language, adjustedLimit));
                            break;
                        default:
                            return res
                                .status(400)
                                .json({ error: `Unsupported question type: ${type}` });
                    }
                    totalQuestions += adjustedLimit;
                }
                // Wait for all question generation tasks to complete
                yield Promise.all(allQuestionTasks);
                // Send a single success response after all tasks are done
                return res.status(200).json({
                    message: "Quiz created successfully",
                    totalQuestions,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
};
exports.default = quizController;
