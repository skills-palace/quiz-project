import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ErrorMessage, Input } from "@/ui/hook-form";
import { BiDuplicate, BiSortAlt2, BiTrash } from "react-icons/bi";
function Item({ idx, id, remove, register, cloneData, errors }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const error = errors.quizes?.[idx]?.title;
  const errorAnswer = errors.quizes?.[idx]?.answer;

  return (
    <div
      className="flex items-center border border-slate-300 p-1 mb-2 rounded-md"
      ref={setNodeRef}
      style={style}
    >
      <div className="mr-2">{idx + 1}.</div>
      <input type="hidden" {...register(`quizes.${idx}.id`)} />
      <input type="hidden" {...register(`quizes.${idx}.ans_id`)} />
      <div className="flex space-x-1 w-full">
        <div className="w-1/2">
          <Input
            register={register(`quizes.${idx}.title`, {
              required: "title is required",
              maxLength: {
                value: 40,
                message: "title not more than 40 character",
              },
            })}
            invalid={error}
            placeholder="line connect title left"
          />
          <ErrorMessage error={error} />
        </div>
        <div className="w-1/2">
          <Input
            register={register(`quizes.${idx}.answer`, {
              required: "answer is required",
              maxLength: {
                value: 80,
                message: "answer not more than 80 character",
              },
            })}
            invalid={errorAnswer}
            placeholder="quiz title"
          />
          <ErrorMessage error={errorAnswer} />
        </div>
      </div>
      <div className="w-32 ml-2">
        <Input
          register={register(`quizes.${idx}.mark`, {
            valueAsNumber: true,
          })}
          placeholder="mark"
        />
      </div>
      <div className="w-24 ml-2 flex space-x-1 text-2xl">
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
