import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

/** Presentational row — safe to render inside DragOverlay (no useSortable). */
export function ReorderItemCard({
  item,
  isDragging = false,
  forOverlay = false,
  setNodeRef,
  style,
  attributes = {},
  dragListeners = {},
}) {
  const quizTitleDirection = detectDirection(item.title);
  const handleLabel =
    quizTitleDirection === "rtl"
      ? "اسحب الصف بأكمله لإعادة ترتيب العناصر"
      : "Drag row to reorder";

  return (
    <div
      className={`flex cursor-grab touch-manipulation select-none items-center justify-between gap-2 rounded-lg border-2 p-3 shadow-lg transition-[box-shadow] duration-300 active:cursor-grabbing sm:p-4 ${
        quizTitleDirection === "rtl"
          ? "min-h-[3rem] bg-gradient-to-r from-blue-100 to-blue-200 font-naskh border-blue-500 sm:min-h-[3.25rem]"
          : "min-h-[3rem] bg-gradient-to-l from-blue-100 to-blue-200 font-sans border-blue-500 sm:min-h-[3.25rem]"
      } text-gray-700 md:hover:shadow-xl ${
        isDragging || forOverlay ? "ring-2 ring-blue-400 ring-offset-1" : ""
      } ${
        forOverlay ? "scale-[1.02] shadow-2xl" : ""
      } md:hover:bg-gradient-to-br md:hover:from-rose-200 md:hover:to-rose-300 md:hover:border-rose-500 md:hover:scale-105`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...dragListeners}
      aria-label={forOverlay ? undefined : handleLabel}
    >
      <Text
        direction={quizTitleDirection}
        className={`min-w-0 flex-1 pr-1 text-justify font-semibold text-gray-800 ${
          quizTitleDirection === "rtl"
            ? "font-naskh text-base sm:text-lg md:text-xl lg:text-xl"
            : "font-sans text-base sm:text-lg md:text-xl"
        }`}
      >
        {item.title}
      </Text>
      <span
        className="pointer-events-none flex shrink-0 select-none items-center justify-center rounded-full bg-blue-600 px-2 py-2 text-lg leading-none text-white shadow-sm sm:text-xl min-h-[2.75rem] min-w-[2.75rem]"
        aria-hidden="true"
      >
        ⇅
      </span>
    </div>
  );
}

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
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <ReorderItemCard
      item={item}
      isDragging={isDragging}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      dragListeners={listeners}
    />
  );
}
