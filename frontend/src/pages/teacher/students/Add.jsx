import { useEffect } from "react";
import { useCreateMutation } from "@/redux/api/learner-api";
import { toast } from "react-toastify";
import Form from "../../../dashboard/students/form";

const Add = ({ close }) => {
  const [mutaion, { isSuccess, isLoading, isError, error }] =
    useCreateMutation();

  const onSubmit = (data) => {
    mutaion(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("created successfully");
      close();
    }
    if (!isSuccess) {
      toast.error(error?.data?.message ?? "something wrong");
    }
  }, []);
  
  if (isSuccess) {
    toast.success("created successfully");
    close();
  }
  return (
    <div>
      
      {error && (
        <div className="bg-yellow-600 bg-opacity-25">
          {error?.data?.message}
        </div>
      )}
      <Form
        title="add student"
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={{ name: "" }}
      />
    </div>
  );
};

export default Add;
