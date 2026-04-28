import { useEffect } from "react";
import { BtnBlue } from "@/dashboard/shared/btn";
import { useRemoveFileMutation } from "@/redux/api/file-manager-api";
import toast from "react-hot-toast";

const Destroy = ({ ids, setSelected }) => {
  const [destry, { isLoading, isSuccess, isError, error }] =
    useRemoveFileMutation();

  useEffect(() => {
    if (isSuccess) {
      setSelected([]);
      toast.success("deleted successfully");
    }
    if (isError) {
      //toast.warn(error?.data?.message ?? "something wrong");
    }
  }, [isSuccess, isError]);

  console.log(ids.join(","));

  return (
    <div className="mr-2">
      <BtnBlue onClick={() => destry(ids.join(","))}>Delete Selected</BtnBlue>
    </div>
  );
};

export default Destroy;
