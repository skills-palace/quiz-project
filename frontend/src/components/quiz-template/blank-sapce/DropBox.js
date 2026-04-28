import React from "react";
import Item from "./Item";
import { useDroppable } from "@dnd-kit/core";

function DropBox({ id, item }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });
  return (
    <div
      ref={setNodeRef}
      className={`border-2 transition-all border-blue-200 bg-sky-100 w-[120px] min-h-[30px]  inline-block mx-1  ${
        isOver ? "border scale-100" : "border-dashed "
      }`}
    >
      {item && <Item item={item} />}
    </div>
  );
}

export default DropBox;
