import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

/** Word-sized chip — safe inside DragOverlay. */
export function RearrangeItemCard({
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
      ? "اسحب أفقياً لإعادة ترتيب الكلمة"
      : "Drag horizontally to reorder";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...dragListeners}
      aria-label={forOverlay ? undefined : handleLabel}
      className={`relative inline-flex max-w-[min(100%,18rem)] shrink-0 cursor-grab touch-manipulation select-none items-center justify-center rounded-lg border px-3 py-2 text-center shadow-md transition-shadow duration-200 active:cursor-grabbing sm:px-3.5 sm:py-2.5 ${
        quizTitleDirection === "rtl" ? "font-naskh" : "font-sans"
      } ${
        isDragging || forOverlay
          ? "z-10 border-sky-600 ring-2 ring-sky-400 ring-offset-1"
          : "border-sky-400/80"
      } min-h-[2.75rem] bg-gradient-to-b from-sky-200 to-sky-300 md:hover:from-sky-100 md:hover:to-sky-200 md:hover:shadow-lg ${
        forOverlay ? "scale-[1.03] shadow-xl" : ""
      }`}
    >
      <Text
        direction={quizTitleDirection}
        className="max-w-full whitespace-nowrap text-sm font-semibold leading-snug text-gray-900 sm:text-base"
      >
        {item.title}
      </Text>
      {(isDragging || forOverlay) && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg bg-white/20"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <RearrangeItemCard
      item={item}
      isDragging={isDragging}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      dragListeners={listeners}
    />
  );
}
