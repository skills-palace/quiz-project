import { useEffect } from "react";
import { BiError } from "react-icons/bi";
import { BtnRed, BtnWhite } from "@/dashboard/shared/btn";

const ConfirmDelete = ({
  title,
  description,
  id,
  useRemoveMutation,
  toggleModal,
  onSuccess,
  onError,
}) => {
  const [remove, { isLoading, isSuccess, isError, error }] =
    useRemoveMutation();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
    if (isError) {
      onError({ message: error?.data?.message ?? "something wrong" });
    }
  }, [isSuccess, isError]);

  return (
    <div class="pb-0 px-0">
      <div class="px-6 pb-6 pt-2 flex">
        <div class="text-red-600">
          <BiError class="w-10 h-10 rounded-full px-2 py-2 bg-red-100" />
        </div>
        <div class="ml-4">
          <h5 class="mb-2 text-lg">{title}</h5>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div class="text-right px-6 py-3 bg-gray-100">
        <BtnWhite
          onClick={toggleModal}
          disabled={isLoading}
          className="px-3 py-2 mr-1"
        >
          Cancel
        </BtnWhite>
        <BtnRed
          onClick={() => remove(id)}
          disabled={isLoading}
          className="px-3 py-2 ml-1"
        >
          Confirm
        </BtnRed>
      </div>
    </div>
  );
};

export default ConfirmDelete;
