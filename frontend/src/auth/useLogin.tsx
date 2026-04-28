import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
export default function useLogin() {
  type IStatus = {
    data: any;
    isLoading: Boolean;
    isSuccess: Boolean;
    isError: Boolean;
    error: any;
  };
  const init = {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  };
  const [status, setStatus] = useState<IStatus>(init);

  const login = async (formData: any) => {
    setStatus({ ...init, isLoading: true });

    try {
      const { data } = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login?set-cookie=true`,
        // url: `http://localhost:5000/api/auth/login?set-cookie=true`,
        method: "POST",
        data: formData,
        withCredentials: true,
      });

      Cookies.set("access_token", data.accessToken, { expires: 1 });
      Cookies.set("refresh_token", data.refreshToken, { expires: 365 });
     
      setStatus({
        ...init,
        isLoading: false,
        isSuccess: true,
        data,
      });
    } catch (error: any) {
      setStatus({
        ...init,
        isLoading: false,
        isError: true,
        error: error.response,
      });
    }
  };

  return [login, status];
}
