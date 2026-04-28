import { useEffect } from "react";
import ConformDialog from "@/components/modal/ConformDialog";
import { useDeleteMutation } from "@/redux/api/learner-api";
import { toast } from "react-toastify";

const Destroy = ({ id, close }) => {
  const [destroy, { isLoading, isSuccess, isError }] = useDeleteMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("student delete successfully");
      close();
    }

    if (isError) {
      toast.warn("something wrong");
      close();
    }
  }, [isSuccess, isError]);

  return (
    <ConformDialog
      confirm={() => destroy(id)}
      close={close}
      isLoading={isLoading}
    />
  );
};

export default Destroy;
