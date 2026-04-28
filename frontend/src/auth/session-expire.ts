import Router from "next/router";
import { dispatch } from "@/redux/store";
import { clearAuth } from "@/redux/slices/app-slice";
import toast from "react-hot-toast";

const sessionExpire = () => {
  dispatch(clearAuth());
  toast.error("session expired");
  Router.push("/login");
};

export default sessionExpire;
