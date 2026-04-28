import React, { useMemo } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./DragItem";

export default function Quizes({ items, layoutDir = "ltr" }) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const stripLabel =
    layoutDir === "rtl" ? "صف الكلمات لإعادة الترتيب" : "Word strip to reorder";

  return (
    <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
      <div
        role="group"
        aria-label={stripLabel}
        className="flex w-full max-w-full flex-nowrap items-stretch justify-start gap-2 overflow-x-auto overflow-y-visible rounded-lg border border-blue-300 bg-blue-100 p-2 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable] sm:gap-2.5 sm:p-3 md:gap-3 md:p-4"
      >
        {items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
}
