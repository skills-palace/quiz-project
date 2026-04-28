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
exports.generateMissingWord = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateMissingWord(req, res, next, content, language, limit) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Generate a prompt for OpenAI
            const prompt = `
      Generate ${limit} only one short sentence with a missing word quiz based on the following content in ${language}:
      ${content}

      Each sentence should:
      1. Include one blank space (____) where the word is missing.
      2. Provide the correct word for the blank.
      3. Provide three incorrect choices as distractors.
      4. Maintain proper grammar and sentence structure.
      5. The sentence must be original from text comprehension.

      Example output format:
      Sentence: Laila heard a _____ sound in the meadow.
      Correct Words: ["soft"]
      Wrong Words: ["loud", "angry", "distant"]
    `;
            // Use OpenAI to generate the questions
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating missing word quizzes.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate missing word questions. Please try again.',
                });
                return;
            }
            // Process and format the generated quiz
            const formattedQuestions = rawQuiz
                .split(/\n\n|\n/) // Split by either double or single newlines
                .filter((line) => line.trim().length > 0);
            const quizObject = {
                title: 'Fill in the blank with the correct word',
                status: '1',
                type: 'missing_word',
                description: content,
                quizes: [],
            };
            formattedQuestions.forEach((block, index, array) => {
                var _a, _b, _c;
                if (index % 3 === 0) {
                    const sentenceLine = block;
                    const correctWordsLine = array[index + 1];
                    const wrongWordsLine = array[index + 2];
                    if (!sentenceLine || !correctWordsLine || !wrongWordsLine) {
                        console.error('Malformed block:', {
                            sentenceLine,
                            correctWordsLine,
                            wrongWordsLine,
                        });
                        return;
                    }
                    const sentence = (_a = sentenceLine.split(':')[1]) === null || _a === void 0 ? void 0 : _a.trim().replace(/"/g, '');
                    const correctWords = JSON.parse(((_b = correctWordsLine.split(':')[1]) === null || _b === void 0 ? void 0 : _b.trim()) || '[]');
                    const wrongWords = JSON.parse(((_c = wrongWordsLine.split(':')[1]) === null || _c === void 0 ? void 0 : _c.trim()) || '[]');
                    if (!sentence || !correctWords.length || !wrongWords.length) {
                        console.error('Invalid sentence or words:', {
                            sentence,
                            correctWords,
                            wrongWords,
                        });
                        return;
                    }
                    const sentenceParts = sentence.split('_____');
                    sentenceParts.forEach((part, idx) => {
                        if (part.trim()) {
                            quizObject.quizes.push({
                                id: (0, generateId_1.generateUniqueId)(),
                                title: part.trim(),
                                type: 'text',
                                mark: '0',
                            });
                        }
                        if (idx < correctWords.length) {
                            quizObject.quizes.push({
                                id: (0, generateId_1.generateUniqueId)(),
                                title: correctWords[idx],
                                type: 'word',
                                mark: '1',
                            });
                            wrongWords.forEach((wrongWord) => {
                                quizObject.quizes.push({
                                    id: (0, generateId_1.generateUniqueId)(),
                                    title: wrongWord,
                                    type: 'wrong_word',
                                    mark: '0',
                                });
                            });
                        }
                    });
                }
            });
            yield controllers_1.quizController.generateStore({ body: quizObject, user: req.user }, res, next);
        }
        catch (error) {
            console.error('Error generating missing word quiz:', error);
            next(error);
        }
    });
}
exports.generateMissingWord = generateMissingWord;
