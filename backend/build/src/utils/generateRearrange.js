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
exports.generateRearrange = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateRearrange(req, res, next, content, language, limit) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prompt = `
      Generate ${limit} Reordering questions of only one sentence from the text comprehension based on the following content in ${language}:
      ${content}

      Each question should:
      1. Provide a short jumbled sentence of no more than 5 words.
      2. The correct order should be returned in the correct format.
      3. The sentence must be original from the understanding of the text

      Example:
      Jumbled Sentence: helps Teamwork solve us faster problems
      Correct Order: Teamwork helps us solve problems faster.
    `;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating rearranged sentence questions.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate rearranged sentence questions. Please try again.',
                });
                return;
            }
            const formattedQuestions = rawQuiz.split('\n').filter(Boolean);
            const quizObject = {
                title: 'Arrange the following words correctly',
                status: '1',
                type: 'rearrange',
                description: content,
                quizes: [],
            };
            formattedQuestions.forEach((line) => {
                const [jumbledSentencePart, correctOrderPart] = line.split('Correct Order:');
                if (!correctOrderPart) {
                    console.error('Malformed line:', line);
                    return; // Skip invalid entries
                }
                const correctOrder = correctOrderPart.trim();
                // Add the correct order as individual words
                correctOrder.split(' ').forEach((word) => {
                    quizObject.quizes.push({
                        id: (0, generateId_1.generateUniqueId)(),
                        title: word,
                        mark: '1',
                    });
                });
            });
            yield controllers_1.quizController.generateStore({ body: quizObject, user: req.user }, res, next);
        }
        catch (error) {
            console.error('Error generating rearrange quiz:', error);
            next(error);
        }
    });
}
exports.generateRearrange = generateRearrange;
