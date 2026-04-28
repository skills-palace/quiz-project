import { nanoid } from "nanoid";
import { BiPlus, BiTrash } from "react-icons/bi";
import { useFormContext, useFieldArray } from "react-hook-form";
import Items from "./Items";
import { ErrorMessage, Input } from "@/ui/hook-form";
import { useQuizFormLayoutDir } from "../useQuizFormLayoutDir";

function Index() {
  const {
    control,
    register,
    formState: { errors },
    getValues,
  } = useFormContext();
  const { layoutDir, isRtl } = useQuizFormLayoutDir();
  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({ control, name: "quizes" });

  const addGroup = () => {
    appendGroup({
      name: `group${groupFields.length + 1}`,
      id: nanoid(),
      items: [{ title: "", id: nanoid() }],
    });
  };

  return (
    <div
      dir={layoutDir}
      className={`my-2 rounded-md border border-slate-300 bg-white p-2 shadow-md ${
        isRtl ? "text-right font-naskh" : "text-left font-sans"
      }`}
    >
      <div className="mb-2 flex justify-between">
        <p>Groups</p>
        <button type="button" onClick={addGroup}>
          <BiPlus className="w-6 h-6 bg-purple-400 text-white rounded" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {groupFields.map((group, groupIdx) => {
          const groupNameErr = errors.quizes?.[groupIdx]?.name;
          return (
            <div className="border border-slate-300 p-2" key={group.id}>
              <input type="hidden" {...register(`quizes[${groupIdx}].id`)} />
              <div className="flex justify-between">
                <Input
                  register={register(`quizes[${groupIdx}].name`, {
                    required: "Group name is required",
                    maxLength: {
                      value: 20,
                      message: "Group name not more than 20 characters",
                    },
                  })}
                  invalid={groupNameErr}
                  placeholder="Group name"
                />
                <button type="button" onClick={() => removeGroup(groupIdx)}>
                  <BiTrash className="w-5 h-5 bg-red-400 text-white rounded mt-2" />
                </button>
              </div>
              <ErrorMessage error={groupNameErr} />
              <Items
                control={control}
                errors={errors}
                nestIdx={groupIdx}
                register={register}
                getValues={getValues}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Index;
