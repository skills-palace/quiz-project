"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modifier = (type, quizes) => {
    if (type === "multiple_choice" ||
        type === "multiple_choice2" ||
        type === "true_false" ||
        type === "math") {
        const items = quizes.reduce((acc, item) => {
            acc.push({ id: item.id, title: item.title, image: item.image });
            return acc;
        }, []);
        return { quizes: items.sort(() => 0.5 - Math.random()) };
    }
    if (type === "rearrange" || type == "reorder" || type === "word_bank") {
        return { quizes: quizes.sort(() => 0.5 - Math.random()) };
    }
    if (type === "group_sort" || type === "classification") {
        const quize = quizes.reduce((acc, item) => {
            acc = Object.assign(Object.assign({}, acc), { root: {
                    items: [...acc.root.items, ...item.items],
                }, [item.id]: {
                    title: item.name,
                    items: [],
                } });
            return acc;
        }, { root: { items: [] } });
        quize.root.items.sort(() => 0.5 - Math.random());
        return { quizes: quize };
    }
    if (type === "missing_word" ||
        type === "blank_space" ||
        type === "highlight_word") {
        let serialId = 1;
        const quiz = quizes.reduce((acc, item) => {
            if (item.type == "word" || item.type === "wrong_word") {
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
        const left = quiz.left.sort(() => 0.5 - Math.random());
        const right = quiz.right.sort(() => 0.5 - Math.random());
        return { quizes: { left, right } };
    }
    if (type === "consonant_blend") {
        function shuffle(arr) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
        const allBlends = quizes.map((q) => String(q.blend));
        const unique = [...new Set(allBlends)];
        const defaultDecoys = [
            "nk", "mp", "st", "nd", "ft", "lf", "nt", "lk", "rn", "lp", "sk", "pt",
        ];
        const splitWrongBlends = (s) => {
            if (s == null || String(s).trim() === "")
                return [];
            return String(s)
                .split(/[,،]/)
                .map((x) => x.trim())
                .filter((w) => w.length > 0 && w !== "undefined");
        };
        const items = quizes.map((item) => {
            const correct = String(item.blend);
            let fromCsv = splitWrongBlends(item.wrongBlends);
            if (fromCsv.length === 0 && (item.wrong1 != null || item.wrong2 != null)) {
                fromCsv = [item.wrong1, item.wrong2]
                    .map((w) => (w == null ? "" : String(w).trim()))
                    .filter((w) => w.length > 0);
            }
            const authorWrongs = fromCsv.filter((w) => w !== correct);
            const authorUnique = [...new Set(authorWrongs)];
            const others = unique.filter((b) => b !== correct);
            let wrong = [];
            if (authorUnique.length > 0) {
                // واحد أو أكثر: نعرض المقطع الصحيح + جميع المقاطع المذكورة
                wrong = authorUnique;
            }
            else {
                // بدون حقل: مقطعان خاطئان (ثلاثة خيارات مع الصحيح) كسابق
                wrong = shuffle(others).filter((b) => !wrong.includes(b));
                wrong = wrong.slice(0, 2);
                if (wrong.length < 2) {
                    const extra = defaultDecoys.filter((d) => d !== correct && !wrong.includes(d));
                    for (const d of extra) {
                        if (wrong.length >= 2)
                            break;
                        wrong = [...wrong, d];
                    }
                }
                while (wrong.length < 2) {
                    wrong = [...wrong, `${correct}z`];
                }
            }
            const options = shuffle([correct, ...wrong]);
            return {
                id: item.id,
                stem: item.stem,
                options,
                mark: item.mark,
            };
        });
        return { quizes: shuffle(items) };
    }
};
exports.default = modifier;
