import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import DragItem from "./DragItem";

export default function DropContainer({ className, items, id }) {
  // const { id, items, className } = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    // <SortableContext id={id} items={ids} strategy={rectSortingStrategy}>
    <div className={className} ref={setNodeRef}>
      {items?.map((item) => (
        <DragItem key={item.id} item={item} />
      ))}
    </div>
    //</SortableContext>
  );
}
