import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical } from "react-icons/fa";
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
  layoutDir = "ltr",
}) {
  const quizTitleDirection = detectDirection(item.title);
  const dragLabel = layoutDir === "rtl"
    ? "اسحب هذا الصف بالكامل لإعادة الترتيب"
    : "Drag entire row to reorder";

  const rowBase =
    quizTitleDirection === "rtl"
      ? "min-h-[3.25rem] bg-gradient-to-r from-blue-100 to-blue-200 font-naskh border-blue-500"
      : "min-h-[3.25rem] bg-gradient-to-l from-blue-100 to-blue-200 font-sans border-blue-500";

  return (
    <div
      className={`flex touch-none select-none items-center gap-3 rounded-lg border-2 p-3 shadow-lg transition-[box-shadow] duration-300 active:cursor-grabbing sm:p-4 ${rowBase} cursor-grab text-gray-700 ${
        isDragging || forOverlay ? "ring-2 ring-blue-400 ring-offset-1" : ""
      } ${forOverlay ? "scale-[1.02] shadow-2xl" : ""} md:hover:shadow-xl`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...dragListeners}
      aria-label={forOverlay ? undefined : dragLabel}
    >
      <Text
        direction={quizTitleDirection}
        className={`min-w-0 flex-1 text-justify font-semibold text-gray-800 ${
          quizTitleDirection === "rtl"
            ? "font-naskh text-base sm:text-lg md:text-xl"
            : "font-sans text-base sm:text-lg md:text-xl"
        }`}
      >
        {item.title}
      </Text>
      <span
        className="pointer-events-none flex shrink-0 select-none items-center justify-center rounded-lg bg-blue-600/90 px-2 py-2 text-white shadow-inner min-h-[2.75rem] min-w-[2.75rem] sm:min-h-[3rem] sm:min-w-[3rem]"
        aria-hidden="true"
      >
        <FaGripVertical className="h-6 w-6 opacity-95 sm:h-7 sm:w-7" />
      </span>
    </div>
  );
}

export default function SortableItem({ id, item, layoutDir }) {
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
      layoutDir={layoutDir}
    />
  );
}
