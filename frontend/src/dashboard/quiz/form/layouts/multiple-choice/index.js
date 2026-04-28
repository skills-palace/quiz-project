import { nanoid } from "nanoid";
import { useFormContext } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import Item from "./Item";
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
import { useQuizFormLayoutDir } from "../useQuizFormLayoutDir";

const MultipleChoice = ({ arrayField }) => {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { layoutDir, isRtl } = useQuizFormLayoutDir();
  const { fields, append, remove, insert, move } = arrayField;

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
      id: nanoid(),
      title: item.title,
      answer: item.answer,
      image: item.image,
      mark: item.mark,
    });
  };

  const setImage = (file) => {
    setModal(false);
    console.log("file", file);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      {/* <Modal close={() => setModal(false)} isOpen={modal}>
        <Media />
      </Modal> */}

      <div
        dir={layoutDir}
        className={`my-2 rounded-md border border-slate-300 bg-white p-2 shadow-md ${
          isRtl ? "text-right font-naskh" : "text-left font-sans"
        }`}
      >
        <p>Multiple Choice</p>

        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((item, idx) => (
            <Item
              register={register}
              errors={errors}
              key={item.id}
              idx={idx}
              id={item.id}
              openModal={() => setModal(true)}
              cloneData={() => cloneData(idx)}
              control={control}
              remove={() => remove(idx)}
            />
          ))}
        </SortableContext>

        <button
          onClick={() => append({ title: "", id: nanoid(), answer: false })}
          type="button"
          className="mt-2"
        >
          <BiPlus className="w-6 h-6 bg-blue-400 text-white rounded" />
        </button>
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
};

export default MultipleChoice;
