import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from "@/auth/useLogout";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearAuth, setAuth } from "@/redux/slices/app-slice";

const LogoutButton = () => {
  const router = useRouter();
  const [logout, { isLoading, isSuccess, isError, error }]: any = useLogout();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccess) {
      dispatch(clearAuth());
      localStorage.removeItem("auth");
      dispatch(setAuth({ status: "noAuth", user: {} }));

      toast.success("logout successfully");
      router.push("/");
    }

    if (isError) {
      toast.success("something wrong");
      console.log("errr", error);
    }
  }, [isSuccess, isError]);
  return (
    <button
      onClick={logout}
      className="px-3 py-2 bg-blue-400 hover:bg-blue-500 transition-all rounded mt-2 w-full text-white"
    >
      {isLoading ? "please wait.." : "logout"}
    </button>
  );
};

export default LogoutButton;
