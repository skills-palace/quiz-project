import { useState } from "react";
import { nanoid } from "nanoid";
import { BtnBlue } from "@/ui/btn";
import { BiPlus, BiX } from "react-icons/bi";
import { useFormContext } from "react-hook-form";
import { useQuizFormLayoutDir } from "../useQuizFormLayoutDir";

function Index({ arrayField }) {
  const { register } = useFormContext();
  const { layoutDir, isRtl } = useQuizFormLayoutDir();
  const { fields, append, insert, remove } = arrayField;
  const [popup, setPopup] = useState({ open: false });
  const [input, setValue] = useState("");
  const [mark, setMark] = useState(0);
  const [editingItem, setEditingItem] = useState(null);

  const setWord = () => {
    if (input) {
      const newItem = {
        id: nanoid(),
        title: input,
        type: popup.type,
        mark: popup.type === "word" ? mark : 0,
      };

      if (editingItem !== null) {
        remove(editingItem.index);
        insert(editingItem.index, newItem);
        setEditingItem(null);
      } else {
        append(newItem);
      }

      setPopup({ open: false });
      setValue("");
      setMark(0);
    }
  };

  const addNewLine = () => {
    append({ id: nanoid(), title: "-", type: "newline", mark: 0 });
  };

  const closePopup = () => {
    setPopup({ open: false });
    setValue("");
    setMark(0);
    setEditingItem(null);
  };

  const handleDoubleClick = (item, idx) => {
    if (item.type !== "newline") {
      setEditingItem({ item, index: idx });
      setValue(item.title);
      setMark(item.mark);
      setPopup({ open: true, type: item.type });
    }
  };

  return (
    <div className="qlayout_four_wrapper qlayout" dir={layoutDir}>
      <div
        className={`min-h-[6rem] rounded border bg-white p-3 shadow-md ${
          isRtl ? "text-right font-naskh" : "text-left font-sans"
        }`}
      >
        {fields.length > 0 ? (
          fields.map((item, idx) => (
            <span key={item.id}>
              <input type="hidden" {...register(`quizes.${idx}.id`)} />
              <input
                type="hidden"
                {...register(`quizes.${idx}.title`)}
                value={item.type === "newline" ? "" : item.title}
              />
              <input type="hidden" {...register(`quizes.${idx}.type`)} />
              <input type="hidden" {...register(`quizes.${idx}.mark`)} />
              {item.type === "newline" ? (
                <div className="w-full border-b border-gray-300 my-2"></div>
              ) : (
                <p
                  className={`relative me-2 inline-block rounded-md px-3 py-1.5 text-sm ${
                    item.type === "word" ? "bg-sky-300 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                  onDoubleClick={() => handleDoubleClick(item, idx)}
                >
                  {item.title}
                  <BiX
                    className={`absolute -top-1 inline-block h-3 w-3 cursor-pointer rounded bg-red-400 text-white ${
                      isRtl ? "-left-0.5" : "-right-0.5"
                    }`}
                    onClick={() => remove(idx)}
                  />
                </p>
              )}
            </span>
          ))
        ) : (
          <span className="p-1 bg-red-200 rounded text-white">
            no word or text added yet
          </span>
        )}
      </div>

      <div className="relative border rounded p-3 mt-4 bg-white shadow-md">
        <div
          className={`absolute transition-all bg-gray-100 rounded-lg shadow-lg border border-gray-200 max-w-xs p-2 -top-32 ${
            popup.open ? "block" : "hidden"
          }`}
        >
          <BiX
            className="absolute top-1 cursor-pointer right-1 rounded text-white bg-red-400 inline-block w-4 h-4"
            onClick={closePopup}
          />
          <p className="mb-2">
            {popup.type === "word" ? "add word" : "add text"}
          </p>
          <input
            type="text"
            className="input-text"
            value={input}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="mt-2 w-full flex justify-between items-center">
            <div className="w-1/2">
              {popup.type === "word" && (
                <input
                  type="number"
                  className="input-text"
                  placeholder="mark"
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                />
              )}
            </div>
            <div>
              <BtnBlue
                className="py-0.5 px-3 rounded text-sm"
                onClick={setWord}
                type="button"
              >
                add
              </BtnBlue>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4">
          <button
            className="bg-sky-300 px-2 py-1 rounded text-white font-semibold text-sm"
            onClick={() => setPopup({ open: true, type: "word" })}
            type="button"
          >
            Add highlight word
          </button>
          <button
            className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-semibold text-sm ml-2"
            onClick={() => setPopup({ open: true, type: "text" })}
            type="button"
          >
            add text
          </button>
          <button
            className="bg-red-400 px-2 py-1 rounded text-white font-semibold text-sm ml-2"
            onClick={addNewLine}
            type="button"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Index;
