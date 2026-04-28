import { nanoid } from "nanoid";
import { BiPlus } from "react-icons/bi";
import { useFormContext } from "react-hook-form";
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
import { useQuizFormLayoutDir } from "../useQuizFormLayoutDir";

function Index({ arrayField }) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { layoutDir, isRtl } = useQuizFormLayoutDir();
  const { fields, append, remove, move, insert } = arrayField;

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
      mark: item.mark,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div
        dir={layoutDir}
        className={`my-2 rounded-md border border-slate-300 bg-white p-2 shadow-md ${
          isRtl ? "text-right font-naskh" : "text-left font-sans"
        }`}
      >
        <p>reorder sentence</p>

        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((item, idx) => (
            <Item
              register={register}
              key={item._id}
              idx={idx}
              errors={errors}
              id={item.id}
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
