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
exports.generateLineConnecting = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateLineConnecting(req, res, next, content, language, limit) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Define the updated prompt for OpenAI
            const prompt = `
    Generate ${limit} a maximum of 4 groups of words and their meanings from the text comprehension based on the following content in ${language}:
    ${content}
  
    Each group must:
    
    - Title contain only one word.
    - Answer contain very short meaning of no more than 6 words..
    
    - Use this exact format:
      Title: Word.
      Answer: Its very short meaning.
      Example:
      Title: Tree
      Answer: A tall plant with branches.
      Title: Book
      Answer: A collection of written pages.
      Title: Water
      Answer: A clear liquid for drinking.
      Title: House
      Answer: A place where people live.
  
  
    
  `;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating line connecting quizzes.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate line connecting quiz. Please try again.',
                });
                return;
            }
            // Parse the raw quiz into lines
            const lines = rawQuiz.split('\n').filter(Boolean);
            const quizObject = {
                type: 'line_connect',
                title: 'Match each word with its appropriate meaning:',
                status: '1',
                description: content,
                quizes: [],
            };
            // Ensure that the number of groups does not exceed 4
            const maxGroups = 4;
            let groupCount = 0;
            // Extract each title and answer pair
            for (let i = 0; i < lines.length && groupCount < maxGroups; i += 2) {
                const titleLine = lines[i];
                const answerLine = lines[i + 1];
                if (!titleLine.startsWith('Title:') ||
                    !answerLine.startsWith('Answer:')) {
                    console.error('Malformed line:', { titleLine, answerLine });
                    continue;
                }
                const title = (_c = titleLine.split(':')[1]) === null || _c === void 0 ? void 0 : _c.trim(); // Extract title
                const answer = (_d = answerLine.split(':')[1]) === null || _d === void 0 ? void 0 : _d.trim(); // Extract answer
                if (!title || !answer) {
                    console.error('Invalid title or answer:', { title, answer });
                    continue;
                }
                quizObject.quizes.push({
                    id: (0, generateId_1.generateUniqueId)(),
                    title,
                    answer,
                    ans_id: (0, generateId_1.generateUniqueId)(),
                    mark: '1',
                });
                groupCount++; // Increment the group count
            }
            // Log the formatted quiz for debugging
            console.log('Formatted Line Connecting Quiz:', JSON.stringify(quizObject, null, 2));
            // Store the quiz using the controller
            yield controllers_1.quizController.generateStore({ body: quizObject, user: req.user }, res, next);
        }
        catch (error) {
            console.error('Error generating line connecting quiz:', error);
            next(error);
        }
    });
}
exports.generateLineConnecting = generateLineConnecting;
