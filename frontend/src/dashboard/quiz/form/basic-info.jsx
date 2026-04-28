import { Label, Input, ErrorMessage, Select } from "@/ui/hook-form";
import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { detectDirection } from "@/utils/detectDirection";

const BasicInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const titleVal = useWatch({ control, name: "title" });
  const dir = useMemo(
    () => detectDirection(titleVal != null ? String(titleVal) : ""),
    [titleVal]
  );
  const isRtl = dir === "rtl";

  return (
    <div
      dir={dir}
      className={`mb-3 rounded-md border border-slate-300 bg-white px-2 py-4 shadow-md ${
        isRtl ? "font-naskh" : "font-sans"
      }`}
    >
      <div className="my-3">
        <Label htmlFor="title"> Activitiy Title</Label>
        <Input
          register={register("title", {
            required: "title is required",
            maxLength: {
              value: 120,
              message: "title not more that 120 charecter",
            },
          })}
          className={isRtl ? "text-right font-naskh" : "text-left font-sans"}
          invalid={errors.title}
          type="text"
          id="title"
          placeholder="Quiz title here..."
        />
        <ErrorMessage error={errors.title} />
      </div>
      <div className="flex">
        <div className="w-1/3">
          <Label htmlFor="title">Status</Label>
          <Select register={register("status", { valueAsNumber: true })}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
