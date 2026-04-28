import React from "react";
import Item from "./Item";

function ItemBox({ items, onWordClick, selectedWordId }) {
  return (
    <div className="mb-4 flex min-h-[3rem] md:min-h-[3.2rem] flex-wrap items-center justify-center gap-x-2 gap-y-2 text-justify rounded-lg border-2 border-blue-400 border-blue-500 bg-gradient-to-l from-sky-300 to-sky-200 p-2 sm:p-3">
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          variant="bank"
          isSelected={selectedWordId === item.id}
          onActivate={() => onWordClick?.(item)}
        />
      ))}
    </div>
  );
}

export default ItemBox;
