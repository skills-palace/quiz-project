"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
const modifier = (type, quizes) => {
    if (type === "multiple_choice2" ||
        type === "multiple_choice" ||
        type === "true_false" ||
        type === "math") {
        const items = quizes.map((item) => {
            if (Array.isArray(item.choices)) {
                item.choices = shuffleArray(item.choices);
            }
            return Object.assign(Object.assign({}, item), { choices: item.choices });
        });
        return { quizes: shuffleArray(items) };
    }
    if (type === "rearrange" || type === "reorder" || type === "word_bank") {
        return { quizes: shuffleArray(quizes) };
    }
    if (type === "group_sort" || type === "classification") {
        const quize = quizes.reduce((acc, item) => {
            const items = Array.isArray(item.items) ? item.items : [];
            acc = Object.assign(Object.assign({}, acc), { root: {
                    items: [...acc.root.items, ...items],
                }, [item.id]: {
                    title: item.name,
                    items: [],
                } });
            return acc;
        }, { root: { items: [] } });
        quize.root.items = shuffleArray(quize.root.items);
        return { quizes: quize };
    }
    if (type === "missing_word") {
        let serialId = 1;
        const quiz = quizes.reduce((acc, item) => {
            if (item.type === "word") {
                acc.quizes.push({ id: serialId, type: item.type });
                acc.meta.root.push({ id: item.id, title: item.title });
                acc.meta[serialId] = null;
                serialId++;
            }
            else {
                acc.quizes.push(item);
            }
            return acc;
        }, { quizes: [], meta: { root: [] } });
        return quiz;
    }
    if (type === "line_connect") {
        const quiz = quizes.reduce((acc, item) => {
            acc.left.push({ title: item.title, id: item.id });
            acc.right.push({ title: item.answer, id: item.ans_id });
            return acc;
        }, { left: [], right: [] });
        const left = shuffleArray(quiz.left);
        const right = shuffleArray(quiz.right);
        return { quizes: { left, right } };
    }
    return { quizes };
};
exports.default = modifier;
