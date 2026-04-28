import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { signOut } from "next-auth/react";

type IState = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: any;
  data: any;
};

const init = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  data: {},
};

export default function useLogout() {
  const [auth, setAuth] = useState<IState>(init);

  const logout = async () => {
    setAuth({ ...init, isLoading: true });
    try {
      // Sign out using NextAuth
      await signOut({ redirect: false });

      // Remove cookies
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      setAuth({
        ...init,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error: any) {
      setAuth({
        ...init,
        isLoading: false,
        isError: true,
        error: error.response || error.message,
      });
    }
  };

  return [logout, auth];
}
