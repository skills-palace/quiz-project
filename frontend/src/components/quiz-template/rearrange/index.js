import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Quizes from "./Quizes";
import Item from "./DragItem";

import { Text } from "@/components/StyledComponents";
import {
  layoutDirectionForSequencedQuiz,
} from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

export default function App({ quiz, nextQ }) {
  const [items, setItems] = useState(quiz.quizes);
  const [activeItem, setActiveItem] = useState();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const layoutDir = useMemo(
    () => layoutDirectionForSequencedQuiz({ ...quiz, quizes: items }),
    [quiz._id, quiz.title, items]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        dir={layoutDir}
        className={`bg-gradient-to-r from-blue-50 to-blue-100 p-2 sm:p-3 rounded-xl shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))] ${
          layoutDir === "rtl" ? "font-naskh" : "font-sans"
        }`}
      >
        {/* Audio Player */}
        {quiz?.questionAudio && (
          <div className="mb-4 md:mb-6">
            <AudioPlayer audioPath={quiz.questionAudio} />
          </div>
        )}

        <QuestionTitleSpeechBar
          title={quiz.title}
          direction={layoutDir}
          questionKey={String(quiz._id || "")}
        />
        <Text
          direction={layoutDir}
          className={` ${
            layoutDir === "rtl"
              ? "text-right pb-4 text-gray-800 font-naskh font-semibold sm:text-lg md:text-lg lg:text-xl"
              : "text-left pb-4 text-gray-800 font-sans  font-semibold sm:text-lg md:text-lg lg:text-lg"
        }`}
        >
          {quiz.title}
        </Text>
        {/* Draggable Quiz Items */}
        <div className="">
          <Quizes items={items} />
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center md:mt-8">
          <button
            type="button"
            onClick={() =>
              nextQ({
                id: quiz._id,
                answers: items.map((ele) => ele.id),
              })
            }
            className={`inline-flex w-full max-w-xs touch-manipulation items-center justify-center px-8 py-3 sm:w-auto sm:max-w-none sm:px-10 min-h-12 md:min-h-[3.25rem] md:py-4 rounded-xl md:rounded-2xl font-semibold text-white shadow-md transition duration-300 ease-in-out active:scale-[0.98] md:hover:scale-105 ${
              layoutDir === "rtl"
                ? "font-naskh bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl lg:text-2xl"
                : "font-sans bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl"
            }`}
          >
            {layoutDir === "rtl" ? "التالي" : "Submit"}
          </button>
        </div>
      </div>
      

      {/* Dragging Overlay */}
      {activeItem && (
        <DragOverlay>
          <Item id={activeItem.id} item={activeItem} />
        </DragOverlay>
      )}
    </DndContext>
  );

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveItem(items.find((item) => item.id === id));
  }

  function handleDragEnd({ active, over }) {
    if (!over) return;

    const { id } = active;
    const { id: overId } = over;

    const activeIndex = items.findIndex((item) => item.id == id);
    const overIndex = items.findIndex((item) => item.id == overId);

    if (activeIndex !== overIndex) {
      setItems((items) => arrayMove(items, activeIndex, overIndex));
    }

    setActiveItem(null);
  }
}
