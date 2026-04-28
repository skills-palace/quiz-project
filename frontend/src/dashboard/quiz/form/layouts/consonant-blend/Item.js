import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormContext, useWatch } from "react-hook-form";
import { Input, ErrorMessage } from "@/ui/hook-form";
import { BiDuplicate, BiSortAlt2, BiTrash } from "react-icons/bi";
import { detectDirection } from "@/utils/detectDirection";
import { useQuizFormLayoutDir } from "../useQuizFormLayoutDir";

function Item({ idx, id, remove, register, errors, cloneData }) {
  const { isRtl } = useQuizFormLayoutDir();
  const { control } = useFormContext();
  const stemW = useWatch({ control, name: `quizes.${idx}.stem`, defaultValue: "" });
  const fullW = useWatch({ control, name: `quizes.${idx}.full`, defaultValue: "" });
  const wrongW = useWatch({
    control,
    name: `quizes.${idx}.wrongBlends`,
    defaultValue: "",
  });
  const rowDir = detectDirection(`${stemW || ""}${fullW || ""}${wrongW || ""}`);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stemErr = errors.quizes?.[idx]?.stem;
  const blendErr = errors.quizes?.[idx]?.blend;
  const fullErr = errors.quizes?.[idx]?.full;

  return (
    <div
      className="border border-slate-300 p-2 mb-2 rounded-md"
      ref={setNodeRef}
      style={style}
      dir={rowDir}
    >
      <div className="flex flex-wrap items-end gap-2">
        <div className="w-6 pt-1 shrink-0">{idx + 1}.</div>
        <input type="hidden" {...register(`quizes.${idx}.id`)} />
        <div className="flex-1 min-w-[80px]">
          <Input
            register={register(`quizes.${idx}.stem`, { required: "required" })}
            invalid={stemErr}
            placeholder="Stem (e.g. ju)"
          />
          <ErrorMessage error={stemErr} />
        </div>
        <div className="w-24">
          <Input
            register={register(`quizes.${idx}.blend`, { required: "required" })}
            invalid={blendErr}
            placeholder="Blend"
          />
          <ErrorMessage error={blendErr} />
        </div>
        <div className="flex-1 min-w-[100px]">
          <Input
            register={register(`quizes.${idx}.full`, { required: "required" })}
            invalid={fullErr}
            placeholder="Full word"
          />
          <ErrorMessage error={fullErr} />
        </div>
        <div className="w-20">
          <Input
            register={register(`quizes.${idx}.mark`, { valueAsNumber: true })}
            placeholder="mark"
          />
        </div>
        <div className="flex space-x-1 text-2xl self-center">
          <button
            className="cursor-pointer focus:ring-2 focus:ring-gray-300 rounded p-0.5"
            type="button"
            {...attributes}
            {...listeners}
          >
            <BiSortAlt2 />
          </button>
          <button
            className="cursor-pointer focus:ring-2 focus:ring-gray-300 rounded p-0.5"
            type="button"
          >
            <BiDuplicate onClick={cloneData} />
          </button>
          <button
            className="cursor-pointer focus:ring-2 focus:ring-gray-300 rounded p-0.5"
            type="button"
          >
            <BiTrash onClick={remove} />
          </button>
        </div>
      </div>
      <div className="mt-2 ps-6 pe-1">
        <p className="text-xs text-slate-500 mb-1">
          {isRtl
            ? "المقاطع الخاطئة (اختياري) — مقطع واحد أو أكثر، افصل بفاصلة: jk, ui, we"
            : "Wrong blends (optional) — one or more, comma-separated: jk, ui, we"}
        </p>
        <Input
          register={register(`quizes.${idx}.wrongBlends`)}
          placeholder="jk, ui, we"
        />
      </div>
    </div>
  );
}

export default Item;
