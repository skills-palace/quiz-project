"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const commonSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    answer: joi_1.default.number().required(),
    mark: joi_1.default.number().default(0),
}));
const multiChoiceSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    answer: joi_1.default.boolean().required(),
    image: joi_1.default.string().allow(""),
    mark: joi_1.default.number().when("answer", {
        is: true,
        then: joi_1.default.required(),
        otherwise: joi_1.default.custom(() => 0),
    }),
}));
const trueFalseSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    answer: joi_1.default.boolean().required(),
    image: joi_1.default.string().allow(""),
    mark: joi_1.default.number().default(0),
}));
const rearrangeSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    mark: joi_1.default.number().default(0),
}));
const groupShortSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    items: joi_1.default.array().items(joi_1.default.object({
        id: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        mark: joi_1.default.number().default(0),
    })),
}));
const missingWordSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.required(),
    type: joi_1.default.string().required(),
    mark: joi_1.default.number()
        .default(0)
        .when("type", {
        is: "word",
        then: joi_1.default.number().default(0),
    }),
}));
const lineConnectSchema = joi_1.default.array().items(joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    answer: joi_1.default.string().required(),
    ans_id: joi_1.default.string().required(),
    mark: joi_1.default.number().default(0),
}));
const consonantBlendSchema = joi_1.default.array()
    .min(1)
    .items(joi_1.default.object({
    id: joi_1.default.string().required(),
    stem: joi_1.default.string().max(64).required(),
    blend: joi_1.default.string().max(32).required(),
    full: joi_1.default.string().max(64).required(),
    /** Comma-separated wrong blends, e.g. "jk, ui, we" — used first for distractors */
    wrongBlends: joi_1.default.string().max(512).allow("").default(""),
    mark: joi_1.default.number().default(0),
}));
const schema = joi_1.default.object({
    title: joi_1.default.string().max(130).required(),
    status: joi_1.default.number().required().valid(0, 1),
    // orderby: Joi.number().required().valid(0, 1),
    audioPath: joi_1.default.string().allow(""),
    questionAudio: joi_1.default.string().allow(""),
    description: joi_1.default.string().max(100000).allow(""),
    type: joi_1.default.string()
        .required()
        .valid("multiple_choice", "multiple_choice2", "rearrange", "group_sort", "classification", "missing_word", "blank_space", "highlight_word", "true_false", "math", "reorder", "line_connect", "classification", "consonant_blend", "word_bank"),
    quizes: joi_1.default.alternatives()
        .conditional("type", {
        switch: [
            { is: "multiple_choice", then: multiChoiceSchema },
            { is: "multiple_choice2", then: multiChoiceSchema },
            { is: "rearrange", then: rearrangeSchema },
            { is: "group_sort", then: groupShortSchema },
            { is: "classification", then: groupShortSchema },
            { is: "missing_word", then: missingWordSchema },
            { is: "blank_space", then: missingWordSchema },
            { is: "highlight_word", then: missingWordSchema },
            { is: "true_false", then: trueFalseSchema },
            { is: "math", then: commonSchema },
            { is: "reorder", then: rearrangeSchema },
            { is: "line_connect", then: lineConnectSchema },
            { is: "consonant_blend", then: consonantBlendSchema },
            { is: "word_bank", then: rearrangeSchema },
        ],
    })
        .required(),
    alternativeSequences: joi_1.default.array()
        .items(joi_1.default.array().items(joi_1.default.string()).min(1))
        .default([])
        .max(32),
});
exports.default = schema;
