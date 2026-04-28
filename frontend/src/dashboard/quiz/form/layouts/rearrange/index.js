import { useMemo } from "react";
import { nanoid } from "nanoid";
import { BiPlus } from "react-icons/bi";
import { useFormContext, useWatch, useFieldArray } from "react-hook-form";
import { getFormLayoutDirectionWithExtra } from "../useQuizFormLayoutDir";
import { BiTrash } from "react-icons/bi";
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Item from "./Item";

function Index({ arrayField }) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext();
  const quizType = useWatch({ control, name: "type" });
  const titleVal = useWatch({ control, name: "title" });
  const quizesWatch = useWatch({ control, name: "quizes" });
  const altLinesWatch = useWatch({ control, name: "alternativeOrderLines" });
  const formLayoutDir = useMemo(() => {
    const altExtra = (altLinesWatch || [])
      .map((r) => (r && "line" in r ? r.line : r))
      .filter((s) => s != null && String(s).trim() !== "")
      .join(" ");
    return getFormLayoutDirectionWithExtra(titleVal, quizesWatch, altExtra);
  }, [titleVal, quizesWatch, altLinesWatch]);
  const { fields, append, insert, remove, move } = arrayField;
  const {
    fields: altFields,
    append: altAppend,
    remove: altRemove,
  } = useFieldArray({
    control,
    name: "alternativeOrderLines",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const cloneData = (idx) => {
    const data = getValues("quizes");
    const item = data[idx];
    insert(idx + 1, {
      title: item.title,
      id: nanoid(),
    });
  };

  // useEffect(() => {
  //   if (!isUpdate) {
  //     append({ title: "", id: nanoid() });
  //   }
  // }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div
        dir={formLayoutDir}
        className={`my-2 rounded-md border border-slate-300 bg-white p-2 shadow-md ${
          formLayoutDir === "rtl" ? "text-right font-naskh" : "text-left font-sans"
        }`}
      >
        <p className="mb-1 font-medium">
          {quizType === "word_bank"
            ? formLayoutDir === "rtl"
              ? "بنك الكلمات — رتّب الكلمات كما ينبغي (من أعلى لأسفل)"
              : "Word bank — list words in the correct sentence order (top to bottom)"
            : formLayoutDir === "rtl"
              ? "إعادة ترتيب الجملة"
              : "Rearrange sentence"}
        </p>

        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((item, idx) => (
            <Item
              register={register}
              key={item._id}
              errors={errors}
              idx={idx}
              id={item.id}
              formLayoutDir={formLayoutDir}
              cloneData={() => cloneData(idx)}
              remove={() => remove(idx)}
            />
          ))}
        </SortableContext>

        <button
          onClick={() => append({ title: "", id: nanoid() })}
          type="button"
          className="btn btn-primary qplus_icon mt-2"
        >
          <BiPlus className="w-6 h-6 bg-blue-400 text-white rounded" />
        </button>

        {(quizType === "word_bank" ||
          quizType === "rearrange" ||
          quizType === "reorder") && (
          <div
            className="mt-5 border-t border-slate-200 pt-3"
            dir={formLayoutDir}
          >
            <p
              className={`mb-1 text-sm font-semibold text-slate-800 ${
                formLayoutDir === "rtl" ? "font-naskh" : "font-sans"
              }`}
            >
              {formLayoutDir === "rtl"
                ? "ترتيبات صحيحة إضافية (اختياري)"
                : "Additional correct orderings (optional)"}
            </p>
            <p
              className={`mb-2 text-xs text-slate-600 ${
                formLayoutDir === "rtl" ? "font-naskh" : "font-sans"
              }`}
            >
              {formLayoutDir === "rtl"
                ? "نفس الكلمات أعلاه مفصولة بفواصل، ترتيب كامل لكل سطر. القائمة العليا أول إجابة صحيحة."
                : "Same words as in the list above, comma-separated, one full sentence per row. The top list is the first accepted answer; add other valid word orders here."}
            </p>
            {altFields.map((f, idx) => (
              <div
                key={f.id}
                className="mb-2 flex items-start gap-2 sm:items-center"
              >
                <span
                  className={`w-5 shrink-0 text-sm text-slate-500 ${
                    formLayoutDir === "rtl" ? "text-left" : "text-right"
                  }`}
                >
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  className={`min-w-0 flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm ${
                    formLayoutDir === "rtl"
                      ? "text-right font-naskh"
                      : "text-left font-sans"
                  }`}
                  placeholder={
                    formLayoutDir === "rtl"
                      ? "مثال: كيف، يمكن، أن، أخدم،؟"
                      : "e.g. How, can, I, help, you?"
                  }
                  {...register(`alternativeOrderLines.${idx}.line`)}
                />
                <button
                  type="button"
                  className="shrink-0 p-1 text-slate-500 hover:text-red-600"
                  onClick={() => altRemove(idx)}
                  title={formLayoutDir === "rtl" ? "حذف" : "Remove"}
                >
                  <BiTrash className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => altAppend({ line: "" })}
              className={`mt-1 inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:underline ${
                formLayoutDir === "rtl" ? "font-naskh" : "font-sans"
              }`}
            >
              <BiPlus className="h-4 w-4" />
              {formLayoutDir === "rtl"
                ? "إضافة ترتيب آخر"
                : "Add another ordering"}
            </button>
          </div>
        )}
      </div>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id == active.id);
      const newIndex = fields.findIndex((item) => item.id == over.id);
      move(oldIndex, newIndex);
    }
  }
}

export default Index;
