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
exports.generateBlankSpace = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateBlankSpace(req, res, next, content, language, limit) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prompt = `
      Generate ${limit} blank spaces question from text comprehension.
      Use the content provided in ${language}: ${content}

       sentence must:
      1. Contain only one blank spaces represented by underscores (___).
      2. Provide the correct word for each blank space directly in the sentence.
      3. The sentence must be from Text Comprehension.
      4. The sentence must not exceed 10 words.
      Example format:
      Sentence 1: "The ___ Tower, located in ___, is one of the most famous landmarks in the world."
      Blanks 1: [["Eiffel"], ["Paris"]]
    `;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating blank space quizzes.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            console.log('Raw Quiz:', rawQuiz);
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate blank space quiz. Please try again.',
                });
                return;
            }
            // Split the raw quiz into lines and filter out empty ones
            const lines = rawQuiz.split('\n').filter(Boolean);
            const quizPayloads = [];
            let currentSentence = '';
            let currentBlanks = [];
            lines.forEach((line) => {
                var _a, _b;
                if (line.startsWith('Sentence')) {
                    // Extract the sentence content
                    currentSentence = (_a = line.split(':')[1]) === null || _a === void 0 ? void 0 : _a.trim().replace(/"/g, '');
                }
                else if (line.startsWith('Blanks')) {
                    // Extract the blanks as an array of arrays
                    currentBlanks = JSON.parse(((_b = line.split(':')[1]) === null || _b === void 0 ? void 0 : _b.trim()) || '[]');
                    if (currentSentence && currentBlanks.length) {
                        // Split the sentence into parts around the blanks
                        const sentenceParts = currentSentence.split('___');
                        // Prepare quiz items for the current sentence
                        const quizItems = [];
                        sentenceParts.forEach((part, idx) => {
                            var _a;
                            if (part.trim()) {
                                // Add fixed text
                                quizItems.push({
                                    id: (0, generateId_1.generateUniqueId)(),
                                    title: [part.trim()],
                                    type: 'text',
                                    mark: '0',
                                });
                            }
                            if (idx < currentBlanks.length) {
                                // Add the correct word in place of the blank
                                quizItems.push({
                                    id: (0, generateId_1.generateUniqueId)(),
                                    title: ((_a = currentBlanks[idx]) === null || _a === void 0 ? void 0 : _a.map((word) => word.trim())) || [],
                                    type: 'word',
                                    mark: '1',
                                });
                            }
                        });
                        // Create a quiz object for the current sentence
                        quizPayloads.push({
                            title: 'Fill in the blank with the correct word',
                            status: '1',
                            type: 'blank_space',
                            description: content,
                            quizes: quizItems,
                        });
                        // Reset for the next sentence
                        currentSentence = '';
                        currentBlanks = [];
                    }
                }
            });
            // Store each quiz payload in the database
            for (const quizPayload of quizPayloads) {
                yield controllers_1.quizController.generateStore({ body: quizPayload, user: req.user }, res, next);
            }
        }
        catch (error) {
            console.error('Error generating blank space quiz:', error);
            next(error);
        }
    });
}
exports.generateBlankSpace = generateBlankSpace;
