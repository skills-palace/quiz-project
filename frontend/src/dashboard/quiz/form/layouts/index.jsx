import { memo, useMemo } from "react";
import { useController, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { detectDirection } from "@/utils/detectDirection";
import Layout9 from "./multiple-choice2"; //multiple_choice2
import Layout1 from "./multiple-choice"; //multiple_choice
import Layout2 from "./rearrange"; //rearrange
import Layout3 from "./group-short"; //group_short
import Layout4 from "./missing-word"; //missing_word
import Layout5 from "./true-false"; //true_false
import Layout6 from "./math"; //math
import Layout7 from "./reorder"; //reorder
import Layout8 from "./line-connect"; //line_connect
import Layout10 from "./classification"; //line_connect
import Layout11 from "./blank-space";
import Layout12 from "./highlight-word";
import LayoutConsonant from "./consonant-blend";
import { nanoid } from "nanoid";

const quizTypes = [
  { title: "Multiple Choice2", name: "multiple_choice2" },
  { title: "Multiple Choice", name: "multiple_choice" },
  { title: "Math", name: "math" },
  { title: "Rearrange", name: "rearrange" },
  { title: "Word bank", name: "word_bank" },
  { title: "Missing Word", name: "missing_word" },
  { title: "Blank Space", name: "blank_space" },
  { title: "Highlight Word", name: "highlight_word" },
  { title: "Group Sort", name: "group_sort" },
  { title: "Classification", name: "classification" },
  { title: "True False", name: "true_false" },
  { title: "Reorder", name: "reorder" },
  { title: "Line connect", name: "line_connect" },
  { title: "Consonant blend", name: "consonant_blend" },
];

const Layouts = () => {
  const { control, unregister, setValue } = useFormContext();
  const titleVal = useWatch({ control, name: "title" });
  const formDir = useMemo(
    () => detectDirection(String(titleVal ?? "")),
    [titleVal]
  );
  const isRtl = formDir === "rtl";

  const arrayField = useFieldArray({
    control,
    name: "quizes",
    keyName: "_id",
    //shouldUnregister: true,
  });

  //console.log("arrayField", arrayField.fields);

  const {
    field: { value, onChange },
  } = useController({
    name: "type",
    // defaultValue: "multiple_choice",
    control,
  });

  const Layouts = {
    multiple_choice2: <Layout9 arrayField={arrayField} />,
    multiple_choice: <Layout1 arrayField={arrayField} />,
    rearrange: <Layout2 arrayField={arrayField} />,
    word_bank: <Layout2 arrayField={arrayField} />,
    group_sort: <Layout3 arrayField={arrayField} />,
    missing_word: <Layout4 arrayField={arrayField} />,
    true_false: <Layout5 arrayField={arrayField} />,
    math: <Layout6 arrayField={arrayField} />,
    reorder: <Layout7 arrayField={arrayField} />,
    line_connect: <Layout8 arrayField={arrayField} />,
    classification: <Layout10 arrayField={arrayField} />,
    blank_space: <Layout11 arrayField={arrayField} />,
    highlight_word: <Layout12 arrayField={arrayField} />,
    consonant_blend: <LayoutConsonant arrayField={arrayField} />,
  };

  const replaceLayoutValue = (key) => {
    if (key === "group_sort" || key === "classification") {
      arrayField.replace([
        {
          id: nanoid(),
          name: "group1",
          items: [{ id: nanoid(), title: "", mark: 0 }],
        },
        {
          id: nanoid(),
          name: "group2",
          items: [{ id: nanoid(), title: "", mark: 0 }],
        },
      ]);
    } else if (
      key === "missing_word" ||
      key === "blank_space" ||
      key === "highlight_word"
    ) {
      arrayField.replace([]);
      return;
    } else if (key === "line_connect") {
      arrayField.replace([
        { id: nanoid(), title: "", answer: "", ans_id: nanoid(), mark: 0 },
      ]);
    } else if (key === "reorder" || key === "rearrange" || key === "word_bank") {
      arrayField.replace([{ id: nanoid(), title: "", mark: 0 }]);
      setValue("alternativeOrderLines", []);
    } else if (key === "consonant_blend") {
      arrayField.replace([
        {
          id: nanoid(),
          stem: "",
          blend: "",
          full: "",
          wrongBlends: "",
          mark: 1,
        },
      ]);
    } else if (key === "math") {
      arrayField.replace([{ id: nanoid(), title: "", answer: 0, mark: 0 }]);
    } else if (
      key === "multiple_choice2" ||
      key === "multiple_choice" ||
      key === "true_false"
    ) {
      arrayField.replace([{ id: nanoid(), title: "", answer: false, mark: 0 }]);
    }
  };

  const setLayout = (key) => {
    unregister("quizes");
    replaceLayoutValue(key);
    onChange(key);
  };

  return (
    <div>
      <div
        dir={formDir}
        className={`mb-4 rounded-md border border-slate-300 bg-white px-2 py-4 shadow-md ${
          isRtl ? "text-right font-naskh" : "text-left font-sans"
        }`}
      >
        <p className="mb-3 text-sm font-medium text-slate-800" id="quiz-type-label">
          Quiz Type
        </p>
        <div
          className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          role="group"
          aria-labelledby="quiz-type-label"
        >
          {quizTypes.map((item) => {
            const selected = value === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setLayout(item.name)}
                aria-pressed={selected}
                aria-label={item.title}
                className={`min-h-[3.25rem] w-full rounded-lg border-2 px-3 py-2.5 text-center text-sm font-semibold leading-snug transition sm:min-h-[2.75rem] sm:text-sm ${
                  selected
                    ? "border-purple-600 bg-gradient-to-b from-purple-50 to-indigo-50 text-purple-950 shadow-sm ring-1 ring-purple-200/80"
                    : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50/90 active:scale-[0.99]"
                } focus-visible:outline focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>
      {Layouts[value]}
    </div>
  );
};

export default memo(Layouts);
