"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quizValidator = (type, mainQuiz, userAnswers, opts = {}) => {
    let mark = 0;
    let obtainMark = 0;
    if (type == "group_sort" || type === "classification") {
        mark = mainQuiz.reduce((acc, group) => (acc += group.items.reduce((acc2, item) => (acc2 += item.mark), 0)), 0);
        const validate = userAnswers.map((answer) => {
            const answerGroup = mainQuiz.find((group) => group.id === answer.id);
            if (!answerGroup)
                return {
                    status: 2,
                    answers: [],
                };
            const getGroupItem = (id) => {
                let groupItem;
                mainQuiz.forEach((group) => {
                    const item = group.items.find((item) => item.id === id);
                    if (item) {
                        groupItem = { item, groupId: group.id };
                    }
                });
                return groupItem;
            };
            const answers = answer.items.map((id) => {
                const userAnswer = getGroupItem(id);
                if (!userAnswer)
                    return { status: 2 };
                const isRight = userAnswer.groupId === answer.id;
                if (isRight)
                    obtainMark += userAnswer.item.mark;
                return { title: userAnswer.item.title, status: isRight ? 1 : 0 };
            });
            return {
                name: answerGroup.name,
                answers,
            };
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (type == "rearrange" || type == "reorder" || type === "word_bank") {
        const alts = Array.isArray(opts && opts.alternativeSequences)
            ? opts.alternativeSequences
            : [];
        const primaryOrder = (mainQuiz || []).map((q) => q.id);
        const sameLen = (seq) => seq && seq.length === primaryOrder.length;
        const seen = new Set();
        const uniqueOrders = [];
        for (const seq of [primaryOrder, ...alts]) {
            if (!Array.isArray(seq) || !sameLen(seq))
                continue;
            const k = seq.join("\u0001");
            if (seen.has(k))
                continue;
            seen.add(k);
            uniqueOrders.push(seq);
        }
        const userIds = userAnswers || [];
        const ordersMatch = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);
        const fullMatch = uniqueOrders.some((ord) => ordersMatch(ord, userIds));
        const correctWords = (mainQuiz || []).map((q) => q === null || q === void 0 ? void 0 : q.title).filter(Boolean);
        const toSentence = (idSeq) => idSeq
            .map((id) => (mainQuiz || []).find((q) => q.id === id))
            .filter((q) => q)
            .map((q) => q.title)
            .join(" ");
        const correctTexts = uniqueOrders.map((ord) => toSentence(ord));
        const validate = (userAnswers || []).map((answer, idx) => {
            const mainAns = mainQuiz[idx];
            const ansQuiz = mainQuiz.find((q) => q.id === answer);
            if (!mainAns) {
                return {
                    status: 0,
                    expectedTitle: undefined,
                };
            }
            if (fullMatch) {
                mark += mainAns.mark;
                obtainMark += mainAns.mark;
                return {
                    status: 1,
                    title: ansQuiz === null || ansQuiz === void 0 ? void 0 : ansQuiz.title,
                    expectedTitle: mainAns === null || mainAns === void 0 ? void 0 : mainAns.title,
                };
            }
            const status = mainAns.id === answer ? 1 : 2;
            if (status === 1)
                obtainMark += mainAns.mark;
            mark += mainAns.mark;
            return {
                status,
                title: ansQuiz === null || ansQuiz === void 0 ? void 0 : ansQuiz.title,
                expectedTitle: mainAns === null || mainAns === void 0 ? void 0 : mainAns.title,
            };
        });
        return {
            quiz_items: validate,
            mark,
            obtainMark,
            review: {
                correctText: correctTexts.join("  •  "),
                correctTexts,
                correctWords,
            },
        };
    }
    if (type === "missing_word") {
        const allWord = mainQuiz.filter((ele) => ele.type === "word");
        const answers = userAnswers.slice(); // Clone userAnswers to avoid modifying the original
        const validate = mainQuiz.map((quiz) => {
            if (quiz.type === "word") {
                const answer = answers[0]; // Get the first answer
                if (answer) {
                    const ansWord = mainQuiz.find((word) => word.id === answer);
                    const currWord = allWord[0]; // Get the first word in allWord
                    const isRight = (currWord === null || currWord === void 0 ? void 0 : currWord.id) === answer;
                    if (isRight) {
                        obtainMark += ansWord.mark;
                        mark += ansWord.mark;
                    }
                    allWord.splice(0, 1); // Remove the processed word
                    answers.splice(0, 1); // Remove the processed answer
                    return {
                        type: ansWord.type,
                        title: ansWord.title,
                        expectedTitle: currWord === null || currWord === void 0 ? void 0 : currWord.title,
                        status: isRight ? 1 : 0,
                    };
                }
                else {
                    // If no answer is available at all
                    return {
                        status: 2,
                        type: quiz.type,
                        expectedTitle: allWord[0] === null || allWord[0] === void 0 ? void 0 : allWord[0].title,
                    };
                }
            }
            else if (quiz.type === "wrong_word") {
                const answerIndex = answers.indexOf(quiz.id);
                if (answerIndex !== -1) {
                    // If the word is in the user's answers but incorrect
                    answers.splice(answerIndex, 1); // Remove the processed wrong_word
                    return {
                        type: quiz.type,
                        title: quiz.title,
                        status: 0, // Mark as incorrect
                    };
                }
                else {
                    // No user answer for this wrong_word
                    return {
                        type: quiz.type,
                        title: quiz.title,
                    };
                }
            }
            else {
                return {
                    type: quiz.type,
                    title: quiz.title,
                };
            }
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (type === "highlight_word") {
        const allWord = mainQuiz.filter((ele) => ele.type === "word");
        const answers = [...userAnswers];
        let obtainMark = 0;
        const total_mark = mainQuiz.reduce((acc, quiz) => acc + (quiz.type === "word" ? quiz.mark : 0), 0);
        const validate = mainQuiz.map((quiz) => {
            if (quiz.type === "word") {
                const currWord = allWord.shift();
                const answer = answers.find((ans) => ans === currWord.id);
                if (answer) {
                    const isRight = (currWord === null || currWord === void 0 ? void 0 : currWord.id) === answer;
                    if (isRight)
                        obtainMark += currWord.mark;
                    answers.splice(answers.indexOf(answer), 1);
                    return {
                        type: currWord.type,
                        title: currWord.title,
                        expectedTitle: currWord === null || currWord === void 0 ? void 0 : currWord.title,
                        status: isRight ? 1 : 0,
                    };
                }
                else {
                    return {
                        status: 0,
                        type: quiz.type,
                        title: currWord === null || currWord === void 0 ? void 0 : currWord.title,
                        expectedTitle: currWord === null || currWord === void 0 ? void 0 : currWord.title,
                    };
                }
            }
            else {
                const isInAnswers = answers.some((ans) => ans === quiz.id);
                if (isInAnswers) {
                    // If the word is in the user's answers but incorrect
                    return {
                        type: quiz.type,
                        title: quiz.title,
                        status: 0, // Mark as incorrect
                    };
                }
                // else
                return {
                    type: quiz.type,
                    title: quiz.title,
                    // no status if not in array of answers
                };
            }
        });
        return { quiz_items: validate, mark: total_mark, obtainMark };
    }
    if (type === "blank_space") {
        const allWord = mainQuiz.filter((ele) => ele.type === "word");
        const answers = userAnswers;
        const validate = mainQuiz.map((quiz, idx) => {
            var _a;
            if (quiz.type === "word") {
                const answer = answers[0];
                if (answer) {
                    const currWord = allWord[0];
                    const isRight = (_a = currWord === null || currWord === void 0 ? void 0 : currWord.title) === null || _a === void 0 ? void 0 : _a.some((titlePart) => titlePart === answer);
                    if (isRight)
                        obtainMark += currWord === null || currWord === void 0 ? void 0 : currWord.mark;
                    mark += currWord === null || currWord === void 0 ? void 0 : currWord.mark;
                    allWord.splice(0, 1);
                    answers.splice(0, 1);
                    const exp = Array.isArray(currWord === null || currWord === void 0 ? void 0 : currWord.title) && currWord.title.length
                        ? currWord.title.join(" / ")
                        : String((currWord === null || currWord === void 0 ? void 0 : currWord.title) ?? "");
                    return {
                        type: currWord.type,
                        title: currWord.title,
                        expectedTitle: exp,
                        status: isRight ? 1 : 0,
                    };
                }
                else {
                    return { status: 2, type: quiz.type, mark, obtainMark };
                }
            }
            else {
                return {
                    type: quiz.type,
                    title: quiz.title,
                    mark,
                    obtainMark,
                };
            }
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (type === "blank_space1") {
        const allWordQuizzes = mainQuiz.filter((ele) => ele.type === "word");
        const textQuizzes = mainQuiz.filter((ele) => ele.type === "text");
        let answers = userAnswers || [];
        let mark = 0;
        let obtainMark = 0;
        const validate = mainQuiz.map((quiz, idx) => {
            if (quiz.type === "word") {
                const answer = answers[0];
                if (answer) {
                    const matchingWord = allWordQuizzes.find((wordQuiz) => wordQuiz.title === answer);
                    const correctAnswer = matchingWord ? matchingWord.title : [];
                    mark += matchingWord ? matchingWord.mark : 0;
                    if (correctAnswer.includes(answer)) {
                        obtainMark += matchingWord ? matchingWord.mark : 0;
                    }
                    answers.splice(0, 1);
                    return {
                        type: "word",
                        title: correctAnswer,
                        status: correctAnswer.includes(answer) ? 1 : 0,
                    };
                }
                else {
                    return { type: "word", title: [], status: 2 };
                }
            }
            else if (quiz.type === "text") {
                const answer = answers[0];
                const isCorrect = quiz.id === answer;
                mark += quiz.mark || 0;
                if (isCorrect) {
                    obtainMark += quiz.mark || 0;
                }
                answers.splice(0, 1);
                return {
                    type: "text",
                    title: quiz.title,
                    status: isCorrect ? 1 : 0,
                };
            }
            else {
                return {
                    type: quiz.type,
                    title: quiz.title,
                };
            }
        });
        return {
            quiz_items: validate,
            mark: mark || 0,
            obtainMark: obtainMark || 0,
        };
    }
    if (type === "line_connect") {
        const validate = userAnswers.map((answer) => {
            //const userAnswer = userAnswers.find((ele: any) => ele.id === quiz.id);
            const quiz = mainQuiz.find((ele) => ele.id === answer.id);
            if (!quiz)
                return { status: 2 };
            const isRight = quiz.ans_id === answer.ans_id;
            const status = isRight ? 1 : 0;
            const userAnswer = isRight
                ? quiz.answer
                : mainQuiz.find((ele) => ele.ans_id === answer.ans_id).answer;
            if (status === 1)
                obtainMark += quiz.mark;
            mark += quiz.mark;
            return {
                title: quiz.title,
                expectedMatch: quiz.answer,
                answer: userAnswer,
                status,
            };
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (type === "consonant_blend") {
        const validate = mainQuiz.map((quiz) => {
            const isAnswer = userAnswers.find((ele) => ele.id === quiz.id);
            mark += quiz.mark;
            if (!isAnswer) {
                return {
                    stem: quiz.stem,
                    full: quiz.full,
                    correctBlend: quiz.blend,
                    status: 2,
                };
            }
            const status = isAnswer.answer === quiz.blend ? 1 : 0;
            if (status)
                obtainMark += quiz.mark;
            return {
                stem: quiz.stem,
                full: quiz.full,
                correctBlend: quiz.blend,
                status,
                selected: isAnswer.answer,
            };
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    if (type == "multiple_choice" || type == "multiple_choice2") {
        const correctOptionTitles = mainQuiz
            .filter((q) => q.answer === true)
            .map((q) => q.title);
        const validate = mainQuiz.map((quiz) => {
            const isAnswer = userAnswers.find((ele) => ele.id === quiz.id);
            mark += quiz.mark;
            if (!isAnswer) {
                return {
                    title: quiz.title,
                    status: 0,
                    isCorrectOption: !!quiz.answer,
                };
            }
            const status = quiz.answer === isAnswer.answer ? 1 : 2;
            if (status)
                obtainMark += quiz.mark;
            return {
                title: quiz.title,
                status,
                answer: isAnswer === null || isAnswer === void 0 ? void 0 : isAnswer.answer,
                isCorrectOption: !!quiz.answer,
            };
        });
        return {
            quiz_items: validate,
            mark,
            obtainMark,
            review: { correctOptionsText: correctOptionTitles.join(" · ") },
        };
    }
    if (["math", "true_false"].includes(type)) {
        const validate = mainQuiz.map((quiz) => {
            const isAnswer = userAnswers.find((ele) => ele.id === quiz.id);
            mark += quiz.mark;
            if (!isAnswer) {
                return {
                    title: quiz.title,
                    status: 2,
                    correctValue: quiz.answer,
                };
            }
            const status = quiz.answer === isAnswer.answer ? 1 : 0;
            if (status)
                obtainMark += quiz.mark;
            return {
                title: quiz.title,
                status,
                answer: isAnswer === null || isAnswer === void 0 ? void 0 : isAnswer.answer,
                correctValue: quiz.answer,
            };
        });
        return { quiz_items: validate, mark, obtainMark };
    }
    return { quiz_items: [], mark: 0, obtainMark: 0 };
};
exports.default = quizValidator;
