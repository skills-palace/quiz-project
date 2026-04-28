import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

export default function SortableItem({ item }) {
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const quizTitleDirection = detectDirection(item.title);
  return (
    <div
      className={`m-auto mb-1 min-h-11 touch-manipulation cursor-grab select-none rounded bg-blue-500 p-2.5 text-white active:cursor-grabbing sm:min-h-12 sm:p-3 lg:min-h-0 md:hover:bg-blue-600 ${
        quizTitleDirection === "rtl"
          ? "font-naskh text-base sm:text-lg"
          : "font-sans text-base sm:text-lg md:text-xl"
      }`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Text direction={quizTitleDirection}>{item.title}</Text>
    </div>
  );
}
