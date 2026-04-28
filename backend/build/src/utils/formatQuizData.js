"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatQuizData = void 0;
const determineAnswer_1 = require("./determineAnswer");
// Helper function to generate MongoDB-like IDs
function generateObjectId() {
    return (Math.random().toString(16).substr(2, 8) +
        Math.random().toString(16).substr(2, 8) +
        Date.now().toString(16).substr(-8));
}
function formatQuizData(rawQuiz, questionConfig) {
    const sections = rawQuiz.split(/\n\n(?=[A-Za-z])/); // Split into sections for each question type
    const formattedQuizzes = [];
    questionConfig.forEach((config, index) => {
        const section = sections[index];
        if (!section)
            return;
        const [title, ...questions] = section.split(/\n(?=\d+\. )/); // First line is title
        const parsedQuestions = questions.map((question) => {
            const [questionText, ...options] = question.split(/\n/);
            const mark = 1; // Assign default mark
            const answer = (0, determineAnswer_1.determineAnswer)(questionText); // Implement logic to extract answers
            return {
                id: generateObjectId(),
                title: questionText.replace(/^\d+\.\s*/, '').trim(),
                mark,
                answer,
            };
        });
        formattedQuizzes.push({
            id: generateObjectId(),
            title: title.trim(),
            type: config.type,
            status: '1',
            description: title,
            quizes: parsedQuestions,
        });
    });
    return formattedQuizzes;
}
exports.formatQuizData = formatQuizData;
