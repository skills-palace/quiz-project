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
exports.generateGroupSort = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateGroupSort(req, res, next, content, language, limit) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Define the prompt for the OpenAI model
            const prompt = `
      Generate ${limit} group sort questions from the text comprehension based on the following content in ${language}:
      content: ${content}:
      - Each question should have two groups.
      - Each group must have a title.
      - Each group must contain between 3 items.
      - Each item must be one or two words, not a sentence.
      - The combined number of items across both groups must not exceed 6.
      Example format:
      Group: "Group Name 1"
      Items: ["Item 1", "Item 2"]
      Group: "Group Name 2"
      Items: ["Item 3", "Item 4"]
    `;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating group sort quizzes.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate group sort quiz. Please try again.',
                });
                return;
            }
            // Parse the raw quiz
            const lines = rawQuiz.split('\n').filter(Boolean);
            const quizObject = {
                type: 'group_sort',
                title: 'Sort this into the following groups',
                status: '1',
                description: content,
                quizes: [],
            };
            let currentGroup = null;
            for (const line of lines) {
                if (line.startsWith('Group:')) {
                    // Save the previous group if it exists
                    if (currentGroup) {
                        quizObject.quizes.push(currentGroup);
                    }
                    // Start a new group
                    currentGroup = {
                        id: (0, generateId_1.generateUniqueId)(),
                        name: (_c = line.split(':')[1]) === null || _c === void 0 ? void 0 : _c.trim().replace(/"/g, ''),
                        items: [],
                    };
                }
                else if (line.startsWith('Items:')) {
                    // Parse items for the current group
                    const items = JSON.parse(((_d = line.split(':')[1]) === null || _d === void 0 ? void 0 : _d.trim()) || '[]');
                    if (currentGroup && Array.isArray(items)) {
                        currentGroup.items = items.map((item) => ({
                            id: (0, generateId_1.generateUniqueId)(),
                            title: item,
                            mark: 1,
                        }));
                    }
                }
            }
            // Add the last group if it exists
            if (currentGroup) {
                quizObject.quizes.push(currentGroup);
            }
            // Validate the quiz object
            if (quizObject.quizes.length === 0) {
                res.status(400).json({
                    error: 'No valid groups were generated. Please try again.',
                });
                return;
            }
            // Debug output
            console.log('Formatted Group Sort Quiz:', JSON.stringify(quizObject, null, 2));
            // Pass the quiz object to the store method in the controller
            yield controllers_1.quizController.generateStore({ body: quizObject, user: req.user }, res, next);
        }
        catch (error) {
            console.error('Error generating group sort quiz:', error);
            next(error);
        }
    });
}
exports.generateGroupSort = generateGroupSort;
