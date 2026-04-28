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
exports.generateReorderQuestions = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateReorderQuestions(req, res, next, content, language, limit) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Define the prompt for the OpenAI model
            const prompt = `
      Generate ${limit} reorder questions from the text comprehension based on the following content in ${language}:
      ${content}

      Each question should:
      1. Provide 4 main ideas or steps in a random order from the text comprehension.
      2. The correct order should be returned in the specified format.

       Example format:
      Jumbled main ideas: 
     "She asked what it was"
     "Luna dreamed of space" 
     "Luna saw a shiny star"
     

      Step 1: "Luna saw a shiny star"
      Step 2: "She asked what it was"
      Step 3: "Luna dreamed of space"
    `;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating reorder questions.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate reorder quiz. Please try again.',
                });
                return;
            }
            const formattedQuestions = rawQuiz.split('\n').filter(Boolean);
            const quizObject = {
                title: 'Arrange the following main ideas in the order they appear in the text:',
                status: '1',
                type: 'reorder',
                description: content,
                quizes: [],
            };
            formattedQuestions.forEach((line) => {
                const match = line.match(/Step \d+:\s*"([^"]+)"/);
                if (!match) {
                    console.error('Malformed line:', line);
                    return; // Skip invalid entries
                }
                const stepTitle = match[1];
                // Add the step as a quiz item
                quizObject.quizes.push({
                    id: (0, generateId_1.generateUniqueId)(),
                    title: stepTitle,
                    mark: '1', // Each step gets a mark of 1
                });
            });
            if (!quizObject.quizes.length) {
                res.status(400).json({
                    error: 'No valid steps were generated. Please try again.',
                });
                return;
            }
            // Debug output
            console.log('Formatted Reorder Quiz:', JSON.stringify(quizObject, null, 2));
            // Pass the quiz object to the store method in the controller
            yield controllers_1.quizController.generateStore({ body: quizObject, user: req.user }, res, next);
        }
        catch (error) {
            console.error('Error generating reorder quiz:', error);
            next(error);
        }
    });
}
exports.generateReorderQuestions = generateReorderQuestions;
