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
const lesson_model_1 = __importDefault(require("../models/lesson.model"));
const lesson_log_model_1 = __importDefault(require("../models/lesson-log.model"));
const ErrorHandler_1 = __importDefault(require("../services/ErrorHandler"));
const quiz_validator_1 = __importDefault(require("../helper/quiz-validator"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("../models/user.model"));
const subscription_1 = require("../utils/subscription");
const hasBrokenImagePath = (imagePath) => {
    if (typeof imagePath !== "string" || !imagePath.trim())
        return false;
    // Uploaded images are stored as relative paths like uploads/123.jpg
    if (imagePath.startsWith("uploads/") || imagePath.startsWith("uploads\\")) {
        const normalizedPath = imagePath.replace(/\\/g, "/");
        const absolutePath = path_1.default.resolve(process.cwd(), normalizedPath);
        return !fs_1.default.existsSync(absolutePath);
    }
    return false;
};
function shuffleArray(array) {
    for (let i = (array === null || array === void 0 ? void 0 : array.length) - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const lessonController = {
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, title, status, limit, sort } = req.query;
            const { _id, role } = req.user;
            const query = {};
            const sortBy = { _id: -1 };
            if (!(role === 1))
                query.author = _id;
            if (title)
                query.title = { $regex: title, $options: "i" };
            if (status)
                query.status = status;
            if (sort === "asc")
                sortBy._id = 1;
            const _page = +page || 1;
            const _limit = +limit || 10;
            const offset = _limit * (_page - 1);
            console.log("_page", _page);
            const total = yield lesson_model_1.default.countDocuments(query);
            try {
                const lessons = yield lesson_model_1.default.find(query)
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
            }
            catch (error) {
                return next(error);
            }
        });
    },
    getLessons(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, title, limit, sort } = req.query;
            const query = {};
            const sortBy = { _id: -1 };
            const pageNumber = page || 1;
            const pageSize = limit || 100;
            if (title)
                query.title = { $regex: title, $options: "i" };
            // Public lessons endpoint should only serve active lessons.
            query.status = 1;
            if (sort) {
                sort === "asc" ? (sortBy._id = 1) : (sortBy._id = -1);
            }
            const offset = pageSize * (pageNumber - 1);
            const total = yield lesson_model_1.default.countDocuments(query);
            try {
                const services = yield lesson_model_1.default.find(query)
                    .sort(sortBy)
                    .skip(offset)
                    .limit(pageSize)
                    .populate("skill")
                    .select("-description");
                services.forEach((lesson) => {
                    if (hasBrokenImagePath(lesson === null || lesson === void 0 ? void 0 : lesson.imagePath)) {
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
            }
            catch (error) {
                return next(error);
            }
        });
    },
    getLesson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params bb", req.params.title);
            try {
                const lessonId = req.params.title;
                if (!mongoose_1.Types.ObjectId.isValid(lessonId)) {
                    return next(ErrorHandler_1.default.error("lesson not found"));
                }
                const lesson = yield lesson_model_1.default.findById(lessonId).populate("quizes", "-status -createdAt -updatedAt");
                if (!lesson)
                    return next(ErrorHandler_1.default.error("lesson not found"));
                if (lesson.status !== 1) {
                    return next(ErrorHandler_1.default.error("lesson not found"));
                }
                if (hasBrokenImagePath(lesson.imagePath)) {
                    lesson.imagePath = "";
                }
                if (Array.isArray(lesson.quizes) && lesson.quizes.length > 0) {
                    lesson.quizes = shuffleArray(lesson.quizes);
                }
                lesson.quizes.forEach((quiz) => {
                    var _a, _b, _c;
                    if (quiz.type === "multiple_choice" ||
                        quiz.type === "multiple_choice2" ||
                        quiz.type === "reorder" ||
                        quiz.type === "true_false" ||
                        quiz.type === "math" ||
                        (quiz.type === "rearrange" && quiz.quizes) ||
                        (quiz.type === "word_bank" && quiz.quizes)) {
                        if (Array.isArray(quiz.quizes) && quiz.quizes.length > 0) {
                            quiz.quizes = shuffleArray(quiz.quizes);
                        }
                    }
                    else if (quiz.type === "line_connect") {
                        if (Array.isArray(quiz.quizes) && quiz.quizes[0]) {
                            if (Array.isArray(quiz.quizes[0].left)) {
                                quiz.quizes[0].left = shuffleArray(quiz.quizes[0].left);
                            }
                            if (Array.isArray(quiz.quizes[0].right)) {
                                quiz.quizes[0].right = shuffleArray(quiz.quizes[0].right);
                            }
                        }
                    }
                    else if (quiz.type === "missing_word") {
                        if (Array.isArray((_a = quiz === null || quiz === void 0 ? void 0 : quiz.meta) === null || _a === void 0 ? void 0 : _a.root)) {
                            quiz.meta.root = shuffleArray(quiz.meta.root);
                        }
                    }
                    else if (quiz.type === "group_sort" ||
                        quiz.type === "classification") {
                        if (Array.isArray(quiz === null || quiz === void 0 ? void 0 : quiz.quizes) && ((_c = (_b = quiz.quizes[0]) === null || _b === void 0 ? void 0 : _b.root) === null || _c === void 0 ? void 0 : _c.items)) {
                            if (Array.isArray(quiz.quizes[0].root.items)) {
                                quiz.quizes[0].root.items = shuffleArray(quiz.quizes[0].root.items);
                            }
                        }
                    }
                });
                return res.status(200).json({
                    result: lesson,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    showForEdit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield lesson_model_1.default.findById(req.params.id).populate("quizes skill");
                if (!doc)
                    return next(ErrorHandler_1.default.error("lesson not found"));
                return res.status(200).json({
                    result: doc,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    validateQuiz(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("validate call");
            const { id, answers, spend_time } = req.body;
            try {
                const jwtUser = req.user;
                if (jwtUser.role !== 1) {
                    const account = yield user_model_1.default.findById(jwtUser._id).lean();
                    if (!account || !(0, subscription_1.hasActiveLearningAccess)(account)) {
                        return next(ErrorHandler_1.default.error("Your Explorer trial has ended. Upgrade to submit quiz results and save progress.", 403));
                    }
                }
                const lesson = yield lesson_model_1.default.findById(id).populate("quizes", "-quizes -status -createdAt -updatedAt");
                if (!lesson)
                    return next("no lessson found");
                //const validateAns = [];
                // console.log("lesson", lesson);
                // console.log("lesson", lesson);
                let totalObtainMark = 0;
                let totalMark = 0;
                const validateAnswers = lesson.quizes.map((quiz) => {
                    //totalMark += quiz.total_mark;
                    const userAnswer = answers.find((ele) => ele.id == quiz.id);
                    const { quiz_items, mark, obtainMark, review } = (0, quiz_validator_1.default)(quiz.type, quiz.raw, userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.answers, {
                        alternativeSequences: quiz.alternativeSequences,
                    });
                    console.log("mrk", mark);
                    // console.log(quiz.title, mark, obtainMark);
                    totalMark += mark;
                    totalObtainMark += obtainMark;
                    return Object.assign({ title: quiz.title, type: quiz.type, mark: mark || 0, obtain_mark: obtainMark || 0, quiz_items }, (review != null && typeof review === "object" ? { review } : {}));
                });
                // return res.json("ok");
                console.log("totalObtainMark", totalObtainMark);
                console.log("totalMark", totalMark);
                const lessonLog = yield lesson_log_model_1.default.create({
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
            }
            catch (error) {
                console.log(error);
                return next(error);
            }
        });
    },
    getLessonLog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessonLog = yield lesson_log_model_1.default.findById(req.params.id);
                if (!lessonLog)
                    return next(ErrorHandler_1.default.error("lesson log not found"));
                return res.status(200).json({
                    result: lessonLog,
                    message: "data fetch successsfully",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    getMyLessonLog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("id: ", req.user._id);
            try {
                const lessonLog = yield lesson_log_model_1.default.find({ learner: req.user._id }).sort({
                    createdAt: -1,
                });
                if (!lessonLog)
                    return next(ErrorHandler_1.default.error("lesson log not found"));
                return res.status(200).json({
                    result: lessonLog,
                    message: "data fetch successsfully",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    cleanupBrokenImages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessons = yield lesson_model_1.default.find({
                    imagePath: { $exists: true, $nin: [null, ""] },
                }).select("_id imagePath");
                const brokenImageLessonIds = lessons
                    .filter((lesson) => hasBrokenImagePath(lesson.imagePath))
                    .map((lesson) => lesson._id);
                if (brokenImageLessonIds.length > 0) {
                    yield lesson_model_1.default.updateMany({ _id: { $in: brokenImageLessonIds } }, { $set: { imagePath: "" } });
                }
                return res.status(200).json({
                    message: "Broken lesson images cleanup completed",
                    inspected: lessons.length,
                    cleaned: brokenImageLessonIds.length,
                    cleanedLessonIds: brokenImageLessonIds,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("here is the updated");
            const { title, time, subject, grade, description, total_mark, skill, quizIds, status, hideParagraphSide, } = req.body;
            const { _id } = req.user;
            const files = req.files;
            const audioPath = files.audioPath ? files.audioPath[0].path : null;
            const imagePath = files.imagePath ? files.imagePath[0].path : null;
            try {
                const ls = yield lesson_model_1.default.create({
                    title,
                    time,
                    description,
                    subject,
                    grade,
                    total_mark,
                    author: _id,
                    quizes: quizIds,
                    status,
                    hideParagraphSide: Number(hideParagraphSide !== null && hideParagraphSide !== void 0 ? hideParagraphSide : 0),
                    skill,
                    audioPath,
                    imagePath,
                });
                return res
                    .status(200)
                    .json({ message: "Lesson created successfully", data: ls });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { title, time, subject, grade, description, total_mark, quizIds, skill, status, hideParagraphSide, } = req.body;
            const files = req.files;
            let audioPath = (files === null || files === void 0 ? void 0 : files.audioPath) ? files.audioPath[0].path : null;
            let imagePath = (files === null || files === void 0 ? void 0 : files.imagePath) ? files.imagePath[0].path : null;
            if (audioPath == undefined) {
                audioPath = req.body.audioPath;
            }
            if (imagePath == undefined) {
                imagePath = req.body.imagePath;
            }
            try {
                const doc = yield lesson_model_1.default.findByIdAndUpdate(id, {
                    title,
                    time,
                    description,
                    subject,
                    skill,
                    grade,
                    total_mark,
                    quizes: quizIds,
                    status,
                    hideParagraphSide: Number(hideParagraphSide !== null && hideParagraphSide !== void 0 ? hideParagraphSide : 0),
                    audioPath,
                    imagePath,
                });
                if (!doc)
                    return next(ErrorHandler_1.default.error("quiz not found"));
                return res
                    .status(200)
                    .json({ message: "quiz update successfully", val: doc });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    show(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield lesson_model_1.default.findOne({ id: req.params.slug });
            if (!document) {
                return next(ErrorHandler_1.default.notFound("No item Found"));
            }
            res.json({
                data: document,
            });
        });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield lesson_model_1.default.findByIdAndDelete(req.params.id);
                if (!doc) {
                    return next(ErrorHandler_1.default.notFound("No data found to delete"));
                }
                return res.status(200).json({
                    message: "lesson deleted successfully",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
};
exports.default = lessonController;
