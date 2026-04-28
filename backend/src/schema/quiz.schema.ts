import Joi from "joi";

const commonSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    answer: Joi.number().required(),
    mark: Joi.number().default(0),
  })
);

const multiChoiceSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    answer: Joi.boolean().required(),
    image: Joi.string().allow(""),
    mark: Joi.number().when("answer", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.custom(() => 0),
    }),
  })
);

const trueFalseSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    answer: Joi.boolean().required(),
    image: Joi.string().allow(""),
    mark: Joi.number().default(0),
  })
);
const rearrangeSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    mark: Joi.number().default(0),
  })
);

const groupShortSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required(),
        mark: Joi.number().default(0),
      })
    ),
  })
);

const missingWordSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    title: Joi.required(),
    type: Joi.string().required(),
    mark: Joi.number()
      .default(0)
      .when("type", {
        is: "word",
        then: Joi.number().default(0),
      }),
  })
);

const lineConnectSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    answer: Joi.string().required(),
    ans_id: Joi.string().required(),
    mark: Joi.number().default(0),
  })
);

const consonantBlendSchema = Joi.array()
  .min(1)
  .items(
    Joi.object({
      id: Joi.string().required(),
      stem: Joi.string().max(64).required(),
      blend: Joi.string().max(32).required(),
      full: Joi.string().max(64).required(),
      /** Comma-separated wrong blends, e.g. "jk, ui, we" — used first for distractors */
      wrongBlends: Joi.string().max(512).allow("").default(""),
      mark: Joi.number().default(0),
    })
  );

const schema = Joi.object({
  title: Joi.string().max(130).required(),
  status: Joi.number().required().valid(0, 1),
  // orderby: Joi.number().required().valid(0, 1),
  audioPath: Joi.string().allow(""),
  questionAudio: Joi.string().allow(""),
  description: Joi.string().max(100000).allow(""),
  type: Joi.string()
    .required()
    .valid(
      "multiple_choice",
      "multiple_choice2",
      "rearrange",
      "group_sort",
      "classification",
      "missing_word",
      "blank_space",
      "highlight_word",
      "true_false",
      "math",
      "reorder",
      "line_connect",
      "classification",
      "consonant_blend",
      "word_bank"
    ),
  quizes: Joi.alternatives()
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
  /** Additional valid full id orders (permutations of the same word ids as `quizes`). */
  alternativeSequences: Joi.array()
    .items(Joi.array().items(Joi.string()).min(1))
    .default([])
    .max(32),
});

export default schema;
