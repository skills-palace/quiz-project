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
exports.generateMath = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateMath(req, res, next, content, language, limit) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate a prompt for OpenAI
            const prompt = `
      Generate ${limit} math questions based on the following content in ${language}:
      ${content}
      
      Each question must have:
      1. A simple math question (addition, subtraction, multiplication, or division) make sure that number of characters of question is not more than ** 40 characters**
      2. The correct answer explicitly mentioned as a **number only** in the format: Answer: [number].
      
      Example:
      Question: 2 + 2
      Answer: 4

      Question: 10 - 3
      Answer: 7
    `;
            // Use OpenAI to generate the questions
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating math questions.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate math questions. Please try again.',
                });
                return;
            }
            const formattedQuestions = rawQuiz
                .split(/\n\s*\n|\n/) // Split by either '\n\n' or '\n' with optional spaces
                .filter((line) => line.trim().length > 0);
            console.log('Formatted Questions:', formattedQuestions);
            // Initialize a single quiz object with a unique ID
            const quizId = (0, generateId_1.generateUniqueId)();
            const quizObject = {
                [quizId]: {
                    title: 'math mid',
                    status: '1',
                    type: 'math',
                    description: content,
                    quizes: [], // Initialize as an empty array
                },
            };
            // Iterate over `formattedQuestions` in pairs
            for (let i = 0; i < formattedQuestions.length; i += 2) {
                const questionText = (_c = formattedQuestions[i]) === null || _c === void 0 ? void 0 : _c.replace(/^\d+\.\s*Question:\s*|^Question:\s*/, '').trim();
                const answerLine = formattedQuestions[i + 1];
                const correctAnswer = (_d = answerLine === null || answerLine === void 0 ? void 0 : answerLine.split(':')[1]) === null || _d === void 0 ? void 0 : _d.trim();
                if (!questionText || !correctAnswer || isNaN(Number(correctAnswer))) {
                    throw new Error(`Invalid question or answer format at index ${i}. Ensure questions and answers follow the correct format.`);
                }
                // Push each question object into the `quizes` array
                quizObject[quizId].quizes.push({
                    id: (0, generateId_1.generateUniqueId)(),
                    title: questionText,
                    mark: '2',
                    answer: correctAnswer, // Answer field
                });
            }
            console.log('Formatted Quiz Object:', quizObject);
            // Pass the quiz object to the `store` method in the controller
            yield controllers_1.quizController.generateStore({ body: quizObject[quizId], user: req.user }, // Pass the request body and user
            res, // Forward the response object
            next // Forward the next function for error handling
            );
        }
        catch (error) {
            next(error); // Forward any error to the error-handling middleware
        }
    });
}
exports.generateMath = generateMath;
