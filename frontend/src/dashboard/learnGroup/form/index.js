import { Suspense, useEffect } from "react";
import BtnWthLoader from "@/components/loader/BtnWthLoader";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
const StudentSelect = dynamic(() => import("./StudentSelect"), {
  ssr: false,
});
function GroupForm({ useMutation, close, defaultValues, value, title }) {
  const [mutation, { isSuccess, isLoading, isError, error }] = useMutation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
    defaultValues,
  });

  const onSubmit = (data) => {
    if (value) {
      mutation({ ...data, _id: value._id });
    } else {
      const { students, ...rest } = data;
      const student_ids = students.map((n) => n._id);
      mutation({ ...rest, student_ids });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      close();
      if (value) {
        toast.success("updated successfully");
      } else {
        toast.success("created successfully");
      }
    }
    if (isError) {
      close();
      toast.error("something wrong");
    }
  }, [isSuccess, isError]);

  return (
    <>
      <h6 className="mb-3">{title}</h6>
      <form className="modal_content_pop_up" onSubmit={handleSubmit(onSubmit)}>
        {isError && (
          <div className="alert alert-danger W-100">{error.data?.message}</div>
        )}
        {/* Form Group start */}
        <div className="form-group">
          <div className="form-label-group">
            <label className="form-label" htmlFor="name">
              Select Student*
            </label>
          </div>
          <div className="form-control-wrap">
            <Suspense fallback={<>Loading...</>}>
              {control && <StudentSelect control={control} />}
            </Suspense>
          </div>
        </div>
        {/* Form Group end */}
        {/* Form Group start */}
        <div className="form-group">
          <div className="form-label-group">
            <label className="form-label" htmlFor="email">
              Group name*
            </label>
          </div>
          <div className="form-control-wrap">
            <input
              className="form-control"
              {...register("name", {
                required: "group name is required",
                minLength: {
                  value: 5,
                  message: "group name 5 charecter long",
                },
                maxLength: {
                  value: 40,
                  message: "group name not more than 40 long",
                },
              })}
            />
            {errors.name && (
              <span className="invalid-err">{errors.name.message}</span>
            )}
          </div>
        </div>
        {/* Form Group end */}

        {/* Form Group start */}
        <div className="form-group">
          <div className="form-label-group">
            <label className="form-label" htmlFor="grade">
              Description
            </label>
          </div>
          <div className="form-control-wrap">
            <textarea className="form-control" {...register("description")} />
          </div>
        </div>
        {/* Form Group end */}

        {/* sumit button start */}
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

export default GroupForm;
