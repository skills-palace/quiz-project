import { Input, Textarea } from "@/ui/hook-form";
import { BiChevronDown, BiChevronUp, BiDuplicate, BiTrash } from "react-icons/bi";

function Item({
  idx,
  remove,
  errors,
  register,
  nestIdx,
  cloneData,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}) {
  const titleErr = errors.quizes?.[nestIdx]?.items?.[idx]?.title;

  return (
    <div className="my-2 flex items-center rounded-md border border-slate-300 p-1">
      <div className="mr-2 shrink-0">{idx + 1}.</div>
      <input
        type="hidden"
        {...register(`quizes[${nestIdx}].items[${idx}].id`)}
      />
      <div className="min-w-0 flex-grow">
        <Textarea
          type="textarea"
          register={register(`quizes[${nestIdx}].items[${idx}].title`, {
            required: "group title required",
            maxLength: {
              value: 50,
              message: "group title not more than 50 character",
            },
          })}
          invalid={titleErr}
          placeholder="quiz title"
        />
      </div>
      <div className="ml-2 w-32 shrink-0">
        <Input
          register={register(`quizes[${nestIdx}].items[${idx}].mark`, {
            valueAsNumber: true,
          })}
          placeholder="mark"
        />
      </div>
      <div className="ml-2 flex w-32 shrink-0 flex-col items-stretch justify-center gap-0.5 sm:w-40 sm:flex-row sm:gap-0.5">
        <div className="flex justify-end gap-0.5 sm:mr-0">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="rounded p-0.5 text-2xl text-slate-600 hover:bg-slate-100 focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move item up"
            title="Move up"
          >
            <BiChevronUp className="h-6 w-6" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="rounded p-0.5 text-2xl text-slate-600 hover:bg-slate-100 focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move item down"
            title="Move down"
          >
            <BiChevronDown className="h-6 w-6" />
          </button>
        </div>
        <div className="flex justify-end gap-0.5 text-2xl sm:ml-0">
          <button
            type="button"
            onClick={cloneData}
            className="cursor-pointer rounded p-0.5 text-slate-600 hover:bg-slate-100 focus:ring-2 focus:ring-sky-300"
            aria-label="Duplicate item"
            title="Duplicate"
          >
            <BiDuplicate />
          </button>
          <button
            type="button"
            onClick={remove}
            className="cursor-pointer rounded p-0.5 text-rose-600 hover:bg-rose-50 focus:ring-2 focus:ring-rose-200"
            aria-label="Remove item"
            title="Delete"
          >
            <BiTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;
