import { Controller } from "react-hook-form";
import { GoCheck, GoX } from "react-icons/go";

function Answer({ idx, control }) {
  return (
    <Controller
      control={control}
      name={`quizes.${idx}.answer`}
      render={({ field: { onChange, value } }) => (
        <div
          onClick={() => onChange(!value)}
          className="w-9 h-9 mx-2 border border-slate-300"
        >
          <div className="flex flex-col justify-center items-center w-full h-full">
            {value ? (
              <GoCheck className="w-7 h-7 text-purple-600" />
            ) : (
              <GoX className="w-7 h-7 text-purple-600" />
            )}
          </div>
        </div>
      )}
    />
  );
}

export default Answer;
