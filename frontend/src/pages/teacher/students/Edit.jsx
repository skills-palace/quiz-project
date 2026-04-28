import { useEffect } from "react";
import { useUpdateMutation } from "@/redux/api/learner-api";
import { toast } from "react-toastify";
import Form from "../../../dashboard/students/form";

const Edit = ({ close, data }) => {
  const [mutaion, { isSuccess, isLoading, isError }] = useUpdateMutation();

  const onSubmit = (form) => {
    mutaion({ form, id: data._id });
  };

  useEffect(() => {
    if (isSuccess) {
      close();
      toast.success("created successfully");
    }
    if (isError) {
      close();
      toast.warn("something wrong");
    }
  }, [isSuccess, isError]);
  return (
    <div>
      <Form
        title="edit student"
        onSubmit={onSubmit}
        defaultValues={data}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Edit;
