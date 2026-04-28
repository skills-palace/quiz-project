import { nanoid } from "nanoid";
import { BiPlus } from "react-icons/bi";
import { useFieldArray } from "react-hook-form";

import Item from "./Item";

function Items({ control, register, getValues, nestIdx, errors }) {
  const name = `quizes[${nestIdx}].items`;
  const { fields, append, insert, remove, move } = useFieldArray({
    control,
    name,
  });

  const cloneData = (idx) => {
    const data = getValues(`quizes[${nestIdx}].items`);
    const item = data[idx];
    insert(idx + 1, {
      title: item.title,
      id: nanoid(),
      answer: item.answer,
    });
  };

  return (
    <div>
      {fields.map((item, idx) => (
        <Item
          key={item.id}
          register={register}
          nestIdx={nestIdx}
          errors={errors}
          idx={idx}
          isFirst={idx === 0}
          isLast={idx === fields.length - 1}
          onMoveUp={() => {
            if (idx > 0) move(idx, idx - 1);
          }}
          onMoveDown={() => {
            if (idx < fields.length - 1) move(idx, idx + 1);
          }}
          cloneData={() => cloneData(idx)}
          remove={() => remove(idx)}
        />
      ))}

      <button
        onClick={() => append({ title: "", id: nanoid(), mark: 0 })}
        type="button"
      >
        <BiPlus className="w-6 h-6 bg-blue-400 text-white rounded" />
      </button>
    </div>
  );
}

export default Items;
