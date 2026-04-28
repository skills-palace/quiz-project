import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLogout from "@/auth/useLogout";
import { clearAuth, setAuth } from "@/redux/slices/app-slice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout, { isLoading, isSuccess, isError, error }] = useLogout();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuth({ status: "noAuth", user: {} }));
      // Clear auth details from local storage and Redux
      localStorage.removeItem("auth");
      dispatch(clearAuth());

      // Notify user and redirect
      toast.success("Logged out successfully");

      // router.push("/");
      window.location.href = "/";
    }

    if (isError) {
      // Notify user about the error
      toast.error("Something went wrong. Please try again.");
      console.error("Logout error:", error);
    }
  }, [isSuccess, isError, dispatch, router]);

  return (
    <button
      onClick={logout}
      className="block text-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      disabled={isLoading}
    >
      {isLoading ? "Please wait..." : "Sign out"}
    </button>
  );
};

export default LogoutButton;
