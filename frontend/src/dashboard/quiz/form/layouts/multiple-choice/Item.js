import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Stsvg from "@/assets/svg/short.svg";
import Cnsvg from "@/assets/svg/clone.svg";
import Dtsvg from "@/assets/svg/delete.svg";
import Answer from "./Answer";
import Image from "./Image";
import { ErrorMessage, Input } from "@/ui/hook-form";
import { BiDuplicate, BiSortAlt2, BiTrash } from "react-icons/bi";

function Item({
  idx,
  id,
  remove,
  errors,
  cloneData,
  register,
  control,
  openModal,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const error = errors.quizes?.[idx]?.title;

  return (
    <div
      className="flex items-center border border-slate-300 p-1 mb-2 rounded-md"
      ref={setNodeRef}
      style={style}
    >
      <input type="hidden" {...register(`quizes.${idx}.id`)} />
      <div className="flex items-center w-32">
        <div className="mr-2">{idx + 1}.</div>
        <Answer control={control} idx={idx} />
        <Image
          control={control}
          idx={idx}
          openModal={openModal}
          alt="quiz image"
        />
      </div>
      <div className="w-full">
        <Input
          register={register(`quizes.${idx}.title`, {
            required: "title is required",
            maxLength: {
              value: 75,
              message: "title not more than 75 character",
            },
          })}
          invalid={error}
          placeholder="quiz title"
        />
        <ErrorMessage error={error} />
      </div>
      <div className="w-32 ml-2">
        <Input
          register={register(`quizes.${idx}.mark`, { valueAsNumber: true })}
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
