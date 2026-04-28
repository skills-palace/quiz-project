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
exports.generateMultipleChoice = void 0;
const openai_1 = __importDefault(require("openai"));
const controllers_1 = require("../controllers");
const generateId_1 = require("./generateId");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateMultipleChoice(req, res, next, content, language, limit) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate a prompt for OpenAI
            const prompt = `
      Generate ${limit} multiple-choice questions based on the following content in ${language}:
      ${content}
      
      Each question must have:
      1. A question text ( question text length must be less than or equal to 130 characters long)
      2. Four options (a, b, c, d)
      3. The correct answer explicitly mentioned in the format: Answer: [correct option].
      4. Strictly follow the example below since we gonna use according to the format!
      Example:
      1. What is the capital of France?
      a) Berlin
      b) Madrid
      c) Paris
      d) Rome
      Answer: c
      strictly do not change 'Answer:' word to any language  which is at the bottom of the options hint: i am saying only the 'Answer' word use start with 'Answer' for languaegs since we gonna format accordingly
    `;
            // Use OpenAI to generate the questions
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating multiple-choice questions.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            console.log('rawQuiz', rawQuiz);
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate multiple-choice questions. Please try again.',
                });
                return;
            }
            // Split by double newlines to separate question blocks
            const formattedQuestions = rawQuiz
                .split(/\n\s*\n/) // Split by '\n\n' or more with optional spaces
                .filter((block) => block.trim().length > 0);
            const quizArray = [];
            const questionSet = new Set(); // To track and avoid duplicate questions
            for (const questionBlock of formattedQuestions) {
                try {
                    // Split the block into lines
                    const lines = questionBlock
                        .split('\n')
                        .map((line) => line.trim())
                        .filter((line) => line.length > 0);
                    if (lines.length < 6) {
                        console.warn(`Question block does not contain enough lines:`, lines);
                        continue; // Skip blocks that don't have enough lines
                    }
                    const currentQuestion = lines[0]
                        .replace(/^(\d+\.\s*|Question:\s*)/, '')
                        .trim();
                    if (questionSet.has(currentQuestion)) {
                        console.warn(`Duplicate question detected and skipped: ${currentQuestion}`);
                        continue; // Skip duplicate questions
                    }
                    questionSet.add(currentQuestion);
                    const options = lines.slice(1, 5); // Extract four options
                    const correctOptionLine = lines.find((line) => line.toLowerCase().startsWith('answer:'));
                    const correctOption = (_d = (_c = correctOptionLine === null || correctOptionLine === void 0 ? void 0 : correctOptionLine.split(':')[1]) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.toLowerCase();
                    if (!correctOption || !['a', 'b', 'c', 'd'].includes(correctOption)) {
                        console.error(`Correct answer is missing or improperly formatted in block: ${questionBlock}`);
                        continue;
                    }
                    const choices = options.map((option, index) => {
                        var _a;
                        const optionLetter = option.charAt(0).toLowerCase();
                        const optionText = ((_a = option.split(')')[1]) === null || _a === void 0 ? void 0 : _a.trim()) || `Option ${index + 1}`;
                        const isCorrect = optionLetter === correctOption;
                        return {
                            id: (0, generateId_1.generateUniqueId)(),
                            title: optionText,
                            mark: isCorrect ? '1' : '0',
                            answer: isCorrect ? 'true' : 'false',
                            image: 'undefined',
                        };
                    });
                    quizArray.push({
                        title: currentQuestion,
                        status: '1',
                        type: 'multiple_choice2',
                        description: content,
                        quizes: choices,
                    });
                }
                catch (error) {
                    console.error(`Error processing question block: ${questionBlock}\nError: ${error.message}`);
                    continue; // Skip invalid question blocks
                }
            }
            // Save the quizzes using the controller
            for (const quiz of quizArray) {
                try {
                    yield controllers_1.quizController.generateStore({ body: quiz, user: req.user }, res, next);
                }
                catch (error) {
                    console.error(`Error storing quiz: ${quiz.title}\nError: ${error.message}`);
                }
            }
        }
        catch (error) {
            next(error); // Forward any error to the error-handling middleware
        }
    });
}
exports.generateMultipleChoice = generateMultipleChoice;
