import React from "react";
import Item from "./Item";

function DropBox({ id, item, isFocused, selectedWord, onBlankClick, onReturnWord, onPlaceFromBankOnFilled }) {
  return (
    <div
      role="group"
      className={`inline-block align-middle mx-1 min-h-11 min-w-[2.85rem] sm:mx-2 lg:min-h-[26px] lg:min-w-[45px] border border-blue-300 bg-sky-50 transition-all rounded-md touch-manipulation ${
        isFocused ? "ring-2 ring-sky-500 ring-offset-1" : ""
      } ${item ? "border-solid" : "border-dashed"}`}
    >
      {item ? (
        <Item
          item={item}
          variant="blank"
          onActivate={() => {
            if (selectedWord) {
              onPlaceFromBankOnFilled(id);
            } else {
              onReturnWord(id);
            }
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => onBlankClick(id)}
          className="inline-flex min-h-11 w-full min-w-[2.85rem] items-center justify-center px-1 py-2 touch-manipulation active:bg-sky-100/70 sm:min-w-12 sm:py-2.5 lg:min-h-[26px] lg:min-w-[45px] lg:py-1"
          aria-label="Blank"
        >
          <span className="text-slate-300 select-none" aria-hidden>
            ___
          </span>
        </button>
      )}
    </div>
  );
}

export default DropBox;
