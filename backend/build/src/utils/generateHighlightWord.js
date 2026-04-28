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
exports.generateHighlightWord = void 0;
const openai_1 = __importDefault(require("openai"));
const generateId_1 = require("./generateId");
const controllers_1 = require("../controllers");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
function generateHighlightWord(req, res, next, content, language, limit) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prompt = `
      Generate ${limit} sets of shuffled words from the text comprehension based on the following content in ${language}:
      ${content}
      
      Each set must: 
      
      1. Contain four words, one of which is verb and four that are not.
      2. Use this exact format:
         Question: highlight_word

         Title: Identify the different word from the following
         Words: "Car, Moon, Came, House, Ran"
         Words that are verbs: ["Came", "Ran"]
         Words that are not verbs: ["Car", "Moon", "House"]

         Title: Identify the different word from the following
         Words: "Slept, Chair, Train, Drank"
         Words that are verbs: ["Drank", "Slept"]
         Words that are not verbs: ["Door", "Train", "Chair"]
    `;
            const response = yield openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant for generating highlight word quizzes.',
                    },
                    { role: 'user', content: prompt },
                ],
            });
            const rawQuiz = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!rawQuiz) {
                res.status(500).json({
                    error: 'Failed to generate highlight word quiz. Please try again.',
                });
                return;
            }
            const formattedQuestions = rawQuiz.split('\n\n').filter(Boolean); // Split by double newlines for each block
            const quizObject = {
                title: 'Identify all the words that indicate verbs:',
                status: '1',
                type: 'highlight_word',
                description: content,
                quizes: [],
            };
            for (const questionBlock of formattedQuestions) {
                try {
                    const lines = questionBlock.split('\n').map((line) => line.trim());
                    const wordsLine = lines.find((line) => line.startsWith('Words:'));
                    const homophonesLine = lines.find((line) => line.startsWith('Words that are verbs:'));
                    const nonHomophonesLine = lines.find((line) => line.startsWith('Words that are not verbs:'));
                    if (!wordsLine || !homophonesLine || !nonHomophonesLine) {
                        console.error('Malformed block:', {
                            wordsLine,
                            homophonesLine,
                            nonHomophonesLine,
                        });
                        continue;
                    }
                    const words = (_c = wordsLine
                        .split(':')[1]) === null || _c === void 0 ? void 0 : _c.trim().replace(/"/g, '').split(',');
                    const homophones = JSON.parse(((_d = homophonesLine.split(':')[1]) === null || _d === void 0 ? void 0 : _d.trim()) || '[]');
                    const nonHomophones = JSON.parse(((_e = nonHomophonesLine.split(':')[1]) === null || _e === void 0 ? void 0 : _e.trim()) || '[]');
                    if (!Array.isArray(words) ||
                        !Array.isArray(homophones) ||
                        !Array.isArray(nonHomophones)) {
                        console.error('Invalid data format in block:', {
                            words,
                            homophones,
                            nonHomophones,
                        });
                        continue;
                    }
                    for (const word of words.map((w) => w.trim())) {
                        const isHomophone = homophones.includes(word);
                        const isNonHomophone = nonHomophones.includes(word);
                        if (!isHomophone && !isNonHomophone) {
                            console.error(`Word not categorized correctly: ${word}`);
                            continue;
                        }
                        quizObject.quizes.push({
                            id: (0, generateId_1.generateUniqueId)(),
                            title: word,
                            type: isHomophone ? 'word' : 'text',
                            mark: isHomophone ? '1' : '0',
                        });
                    }
                }
                catch (error) {
                    console.error(`Error processing question block: ${questionBlock}\nError: ${error.message}`);
                    continue;
                }
            }
            console.log('Formatted Highlight Word Quiz:', JSON.stringify(quizObject, null, 2));
            yield controllers_1.quizController.generateStore({ body: quizObject, user: req.user }, res, next);
        }
        catch (error) {
            console.error('Error generating highlight word quiz:', error);
            next(error);
        }
    });
}
exports.generateHighlightWord = generateHighlightWord;
