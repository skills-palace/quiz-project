import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

export default function SortableItem({ id, item }) {
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const quizTitleDirection = detectDirection(item.title);

  return (
    <div
      className={`flex cursor-grab touch-manipulation items-center justify-between rounded-lg border-2 p-3 shadow-lg transition-[box-shadow] duration-300 select-none active:cursor-grabbing sm:p-4 ${
          quizTitleDirection === "rtl"
            ? "min-h-12 bg-gradient-to-r from-blue-100 to-blue-200 font-naskh border-blue-500 sm:min-h-14 lg:min-h-0"
            : "min-h-12 bg-gradient-to-l from-blue-100 to-blue-200 font-sans border-blue-500 sm:min-h-14 lg:min-h-0"
        } 
        text-gray-700
        md:hover:shadow-xl
        ${
          isDragging ? "ring-2 ring-blue-400 ring-offset-1" : ""
        } md:hover:bg-gradient-to-br md:hover:from-rose-200 md:hover:to-rose-300 md:hover:border-rose-500 md:hover:scale-105`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Text
        direction={quizTitleDirection}
        className={`min-w-0 flex-1 pr-2 text-justify font-semibold text-gray-800 ${
          quizTitleDirection === "rtl" 
          ? "font-naskh text-base sm:text-lg md:text-xl lg:text-xl" 
          : "font-sans text-base sm:text-lg md:text-xl"
        }`}
      >
        {item.title}
      </Text>
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-blue-600 px-2 py-2 text-lg leading-none text-white shadow-sm touch-manipulation min-h-[2.75rem] min-w-[2.75rem] sm:text-xl md:hover:bg-blue-500"
        aria-hidden="true"
      >
        ⇅
      </span>
    </div>
  );
}
