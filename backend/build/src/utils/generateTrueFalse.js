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
exports.generateTrueFalse = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateTrueFalse(req, res, next, content, language, limit) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate a prompt for OpenAI
            const prompt = `
      Generate ${limit} true/false questions from text comprehension based on the following content in ${language}:
      ${content}
      
      Each question must have:
      1. A question text.
      2. The correct answer explicitly mentioned in the format: Answer: [true/false].
      3. Write short sentences from text comprehension of no more than 6 words.
      4. Number of phrases (3-5 phrases only).
      Example:
      Question: Photosynthesis is the process by which plants use sunlight to synthesize food.
      Answer: true

      Question: The capital of France is Berlin.
      Answer: false
      
      Ensure the answers are only "true" or "false" without additional text or explanations.
    `;
            // Use OpenAI to generate the questions
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating true/false questions.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate true/false questions. Please try again.',
                });
                return;
            }
            const formattedQuestions = rawQuiz
                .split(/\n\s*\n|\n/) // Split by either '\n\n' or '\n' with optional spaces
                .filter((line) => line.trim().length > 0);
            console.log('formattedQuestions', formattedQuestions);
            // Initialize the quiz object
            const quiz = {
                title: 'Put ✓ in front of the correct sentence and ✘ in front of the incorrect sentence:',
                status: '1',
                type: 'true_false',
                description: content,
                quizes: [],
            };
            // Iterate over `formattedQuestions` in pairs
            for (let i = 0; i < formattedQuestions.length; i += 2) {
                const questionText = (_c = formattedQuestions[i]) === null || _c === void 0 ? void 0 : _c.replace(/^\d+\.\s*Question:\s*|^Question:\s*/, '').trim();
                const rawAnswer = (_e = (_d = formattedQuestions[i + 1]) === null || _d === void 0 ? void 0 : _d.split(':')[1]) === null || _e === void 0 ? void 0 : _e.trim().toLowerCase();
                if (!questionText || (rawAnswer !== 'true' && rawAnswer !== 'false')) {
                    throw new Error(`Invalid question or answer format at index ${i}`);
                }
                const quizItem = {
                    id: (0, generateId_1.generateUniqueId)(),
                    title: questionText,
                    mark: '1',
                    answer: rawAnswer,
                };
                quiz.quizes.push(quizItem);
            }
            // Pass the quiz object to the `store` method in the controller
            yield controllers_1.quizController.generateStore({ body: quiz, user: req.user }, // Pass the request body and user
            res, // Forward the response object
            next // Forward the next function for error handling
            );
        }
        catch (error) {
            next(error); // Forward any error to the error-handling middleware
        }
    });
}
exports.generateTrueFalse = generateTrueFalse;
