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
exports.generateClassification = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateClassification(req, res, next, content, language, limit) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Adjust the limit to ensure it aligns with the requirement
            const adjustedLimit = limit === 1 ? 2 : limit;
            // Define the prompt for OpenAI
            const prompt = `
Generate ${limit} group sort questions from the text comprehension based on the following content in ${language}:
      content: ${content}:

      Question: classification
      Title: Sort the following words into two groups:
      - Each group has a special title.
      - The item is a single word or a sentence (two to five words).
      - The maximum number of items in both groups together is 6 items.
      - The maximum number of groups is two.
      - The minimum number of groups is two.
      - The minimum number of items in each group is two.
      - The maximum number of items in each group is 4 items.
      Content: ${content}
      Language: ${language}
      Generate ${adjustedLimit} groups for classification.

      Example format:
      Group: "Group Name animals"
      Items: ["Lion", "Dog", "Cat"]
      Group: "Group Name Birds"
      Items: ["Crow", "Ostrich", "Eagle"]
    `;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating classification quizzes.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate classification quiz. Please try again.',
                });
                return;
            }
            // Parse the raw quiz response
            const groups = rawQuiz.split('\n').filter(Boolean);
            const quizObject = {
                type: 'classification',
                title: 'Sort the following words into two groups:',
                status: '1',
                description: content,
                quizes: [],
            };
            // Extract each group and its items
            for (let i = 0; i < groups.length; i += 2) {
                const groupLine = groups[i];
                const itemsLine = groups[i + 1];
                if (!groupLine.startsWith('Group:') || !itemsLine.startsWith('Items:')) {
                    console.error('Malformed group:', { groupLine, itemsLine });
                    continue;
                }
                const groupName = (_c = groupLine.split(':')[1]) === null || _c === void 0 ? void 0 : _c.trim().replace(/"/g, ''); // Extract group name
                const items = JSON.parse(((_d = itemsLine.split(':')[1]) === null || _d === void 0 ? void 0 : _d.trim()) || '[]'); // Parse items array
                if (!groupName || !Array.isArray(items)) {
                    console.error('Invalid group or items:', { groupName, items });
                    continue;
                }
                // Transform items into an array of objects
                const formattedItems = items.map((item) => ({
                    id: (0, generateId_1.generateUniqueId)(),
                    title: item,
                    mark: 1,
                }));
                quizObject.quizes.push({
                    id: (0, generateId_1.generateUniqueId)(),
                    name: groupName,
                    items: formattedItems,
                });
            }
            // Debug output
            console.log('Formatted Classification Quiz:', JSON.stringify(quizObject, null, 2));
            // Pass the quiz object to the store method in the controller
            yield controllers_1.quizController.generateStore({ body: quizObject, user: req.user }, res, next);
        }
        catch (error) {
            console.error('Error generating classification quiz:', error);
            next(error);
        }
    });
}
exports.generateClassification = generateClassification;
