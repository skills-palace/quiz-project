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
    opacity: isDragging ? 0.5 : 1, // Slight transparency while dragging for better feedback
    zIndex: isDragging ? 50 : 0, // Bring the dragged item to the front
  };

  const quizTitleDirection = detectDirection(item.title);

  // Dynamic styles based on direction
  const textAlign = quizTitleDirection === "rtl" ? "text-right" : "text-left";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative min-h-12 cursor-grab touch-manipulation select-none active:cursor-grabbing sm:min-h-14 lg:min-h-0 ${
        quizTitleDirection === "rtl" ? "font-naskh" : "font-sans"
      } rounded-lg border border-gray-200 bg-gradient-to-r from-sky-300 to-sky-200 p-3 shadow-lg transition-shadow duration-300 sm:p-4 ${
        isDragging ? "border-sky-400" : "border-gray-200"
      } ${textAlign} md:hover:from-rose-300 md:hover:to-rose-200 md:hover:shadow-xl`}
    >
     
             <Text
               direction={quizTitleDirection}
               className={`${
                 quizTitleDirection === "rtl"
                 ? "text-center text-base text-gray-800 font-naskh font-semibold sm:text-lg md:text-xl lg:text-2xl"
                 : "text-center text-base text-gray-800 font-sans font-semibold sm:text-lg md:text-lg lg:text-xl"
             }`}
             >
               {item.title}
             </Text>
      {isDragging && (
        <div
          className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg pointer-events-none"
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}
