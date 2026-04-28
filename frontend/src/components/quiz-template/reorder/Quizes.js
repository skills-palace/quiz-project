import { useMemo } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import SortableItem from "./DragItem";

export default function Quizes({ items }) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  return (
    <SortableContext items={ids} strategy={rectSortingStrategy}>
      <div className="question_wrapper flex w-full max-w-full flex-col gap-2 rounded-lg border border-blue-300 bg-blue-100 p-2 sm:p-3 md:gap-3 md:p-4">
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id} item={item} />
        ))}
      </div>
    </SortableContext>
  );
}
