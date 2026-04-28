import { nanoid } from "nanoid";
import { BiPlus } from "react-icons/bi";
import { useFormContext } from "react-hook-form";
import Items from "./Items";
import { ErrorMessage, Input } from "@/ui/hook-form";
import { BiTrash } from "react-icons/bi";
import { useQuizFormLayoutDir } from "../useQuizFormLayoutDir";

function Index({ arrayField }) {
  const {
    control,
    register,
    formState: { errors },
    getValues,
  } = useFormContext();
  const { layoutDir, isRtl } = useQuizFormLayoutDir();
  const { fields, append, remove, replace } = arrayField;

  return (
    <div
      dir={layoutDir}
      className={`my-2 rounded-md border border-slate-300 bg-white p-2 shadow-md ${
        isRtl ? "text-right font-naskh" : "text-left font-sans"
      }`}
    >
      <div className="mb-2 flex justify-between">
        <p>Classification</p>
        <button
          type="button"
          onClick={() =>
            append({
              name: `group${fields.length + 1}`,
              id: nanoid(),
              items: [{ title: "", id: nanoid() }],
            })
          }
        >
          <BiPlus className="w-6 h-6 bg-purple-400 text-white rounded" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((item, idx) => {
          const nameErr = errors.quizes?.[idx]?.name;
          return (
            <div className="border border-slate-300 p-2" key={item.id}>
              <input type="hidden" {...register(`quizes[${idx}].id`)} />
              <div>
                <Input
                  register={register(`quizes[${idx}].name`, {
                    required: "group name is required",
                    maxLength: {
                      value: 50,
                      message: "group name not more than 50 character",
                    },
                  })}
                  invalid={nameErr}
                  placeholder="group name"
                />
                <ErrorMessage error={nameErr} />
              </div>

              <button type="button" onClick={() => remove(idx)}>
                <BiTrash className="w-5 h-5 bg-red-400 text-white rounded mt-2" />
              </button>

              <div className="items_wrapper">
                <Items
                  control={control}
                  errors={errors}
                  nestIdx={idx}
                  register={register}
                  getValues={getValues}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Index;
