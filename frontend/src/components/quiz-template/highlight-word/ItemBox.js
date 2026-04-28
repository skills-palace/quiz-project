import React, { useMemo } from "react";
import Item from "./Item";
import { useDroppable } from "@dnd-kit/core";

function ItemBox({ items }) {
  const { setNodeRef } = useDroppable({
    id: "quizItems",
  });

  return (
    <div
      ref={setNodeRef}
      className="flex justify-center text-justify mb-4  border-blue-400 border-2 rounded p-4 min-h-[3.2rem]"
    >
      {items.map((item, idx) => (
        <Item item={item} key={item.id} />
      ))}
    </div>
  );
}

export default ItemBox;
