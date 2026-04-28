import { useForm } from "react-hook-form";
import BtnWthLoader from "@/components/loader/BtnWthLoader";
import StudentSelect from "./StudentSelect";

function UserForm({ title, onSubmit, defaultValues, isLoading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    defaultValues,
  });

  return (
    <>
      <h6 className="mb-3">{title}</h6>
      <form className="modal_content_pop_up" onSubmit={handleSubmit(onSubmit)}>
        {/* Form Group start */}
        <div className="form-group">
          <div className="form-label-group">
            <label className="form-label" htmlFor="name">
              Named*
            </label>
          </div>
          <div className="form-control-wrap">
            <StudentSelect control={control} />
          </div>
        </div>
        {/* Form Group end */}
        {/* Form Group start */}
        <div className="form-group">
          <div className="form-label-group">
            <label className="form-label" htmlFor="email">
              Student Code*
            </label>
          </div>
          <div className="form-control-wrap">
            <input
              className="form-control"
              {...register("code", {
                required: "student code is required",
                minLength: {
                  value: 5,
                  message: "student code 5 charecter long",
                },
                maxLength: {
                  value: 40,
                  message: "student code not more than 40 long",
                },
              })}
            />
            {errors.email && (
              <span className="invalid-err">{errors.email.message}</span>
            )}
          </div>
        </div>
        {/* Form Group end */}

        {/* Form Group start */}
        <div className="form-group">
          <div className="form-label-group">
            <label className="form-label" htmlFor="grade">
              Student grade*
            </label>
          </div>
          <div className="form-control-wrap">
            <select {...register("grade")} className="form-control" id="grade">
              <option value="All-Grades">All-Grades</option>
              <option value="k">K</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
              <option value="5th">5th</option>
              <option value="6th">6th</option>
              <option value="7th">7th</option>
              <option value="8th">8th</option>
            </select>
            {errors.password && (
              <span className="invalid-err">{errors.password.message}</span>
            )}
          </div>
        </div>
        {/* Form Group end */}

        {/* sumit button start */}
        <BtnWthLoader
          text="submit"
          loadingText="submitting"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        />
        <button
          type="submit"
          class="bg-blue-500 mt-1 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
          Button
        </button>
        {/* sumit button start */}
      </form>
    </>
  );
}

export default UserForm;
