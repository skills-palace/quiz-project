"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quizValidator = (type, mainQuiz, userAnswers) => {
    let mark = 0;
    let obtainMark = 0;
    if (type == "group_sort") {
        const validate = mainQuiz.map((quiz) => {
            const answerGroup = userAnswers.find((n) => n.id == quiz.id);
            // const answers = quiz.items.map((groupItem) => {
            //   const answer = answerGroup.items.find((n) => n.id == groupItem.id);
            //   return { ...groupItem, is_right: !!answer };
            // });
            // const answers = answerGroup?.map((item) => {
            //   const answer = answerGroup.items.find((n) => n.id == groupItem.id);
            // });
            return {
                name: quiz.name,
                right_answer: quiz.items,
                answer: answerGroup.items,
            };
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (type == "rearrange" || type == "reorder") {
        const validate = mainQuiz.map((quiz, idx) => {
            const answer = userAnswers[idx];
            const status = answer ? (quiz.id === answer ? 1 : 2) : 0;
            if (status === 1)
                obtainMark += quiz.mark;
            mark += quiz.mark;
            return {
                status,
                title: quiz.title,
            };
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (type == "missing_word") {
        const validate = mainQuiz.map((quiz) => {
            var _a;
            if (quiz.type == "word") {
                const answer = userAnswers.find((n) => n.id == quiz.id);
                return {
                    type: "word",
                    is_right: !!answer,
                    right_answer: quiz.title,
                    answer: (_a = answer === null || answer === void 0 ? void 0 : answer.title) !== null && _a !== void 0 ? _a : "",
                };
            }
            else {
                return quiz;
            }
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (["multiple_choice", "math", "true_false", "line_connect"].includes(type)) {
        const validate = mainQuiz.map((quiz) => {
            const isAnswer = userAnswers.find((ele) => ele.id === quiz.id);
            console.log("isAnswer", isAnswer);
            console.log("quiz", quiz);
            //console.log("userAnswers", userAnswers);
            const status = isAnswer ? (quiz.answer === isAnswer.answer ? 1 : 2) : 0;
            if (status === 1)
                obtainMark += quiz.mark;
            mark += quiz.mark;
            return {
                title: quiz.title,
                status,
                // is_right: !!answer,
                // right_answer: quiz.answer,
                // answer: answer?.answer,
            };
        });
        console.log("mark", mark);
        console.log("obtainMark", obtainMark);
        return { quiz_items: validate, mark, obtainMark };
    }
};
exports.default = quizValidator;
