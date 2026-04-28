import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ErrorMessage, Input } from "@/ui/hook-form";
import { BiDuplicate, BiSortAlt2, BiTrash } from "react-icons/bi";
function Item({ idx, id, remove, cloneData, register, errors, formLayoutDir = "ltr" }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const error = errors.quizes?.[idx]?.title;

  const isRtl = formLayoutDir === "rtl";

  return (
    <div
      dir={formLayoutDir}
      className={`mb-2 flex items-center rounded-md border border-slate-300 p-1 ${
        isRtl ? "font-naskh" : "font-sans"
      }`}
      ref={setNodeRef}
      style={style}
    >
      <div className={isRtl ? "ml-2" : "mr-2"}>{idx + 1}.</div>
      <input type="hidden" {...register(`quizes.${idx}.id`)} />
      <div className="flex-grow">
        <Input
          register={register(`quizes.${idx}.title`, {
            required: "title is required",
            maxLength: {
              value: 40,
              message: "title not more than 40 character",
            },
          })}
          className={isRtl ? "text-right font-naskh" : "text-left font-sans"}
          invalid={error}
          placeholder="quiz title"
        />
        <ErrorMessage error={error} />
      </div>
      <div className={`w-32 ${isRtl ? "mr-2" : "ml-2"}`}>
        <Input
          register={register(`quizes.${idx}.mark`, { valueAsNumber: true })}
          placeholder="mark"
          className={isRtl ? "text-right font-naskh" : "text-left font-sans"}
        />
      </div>
      <div
        className={`flex w-24 shrink-0 items-center gap-1 text-2xl ${
          isRtl ? "mr-2" : "ml-2"
        }`}
      >
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
  );
}

export default Item;
