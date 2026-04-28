import axios from "axios";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import sessionExpire from "@/auth/session-expire";

const FALLBACK_LIVE_BASE_URL = "https://server-end-point.skillspalace.com";
const FALLBACK_LOCAL_BASE_URL = "http://localhost:5004";

const resolvePublicBaseUrl = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase();
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    if (isLocalHost) {
      return process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_LOCAL_BASE_URL;
    }
    return FALLBACK_LIVE_BASE_URL;
  }

  // Server-side fallback for any non-browser execution path.
  return process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_LIVE_BASE_URL;
};

const PUBLIC_BASE_URL = resolvePublicBaseUrl();

const axiosApi = axios.create({
  baseURL: `${PUBLIC_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    // "content-type": "application/json",
    // accept: "application/json",
  },
});

// Add a request interceptor to set the Authorization header
axiosApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(
          `${PUBLIC_BASE_URL}/api/auth/refresh-token`,
          {
            withCredentials: true,
            headers: {
              "content-type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${Cookies.get("refresh_token")}`,
            },
          }
        );

        console.log("refresh token");
        const newAccessToken = response.data.accessToken;
        const inOneDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // current time + 24 hours
        Cookies.set("access_token", newAccessToken, { expires: inOneDay });

        // Update the session with the new access token
        await signIn("credentials", {
          redirect: false,
          accessToken: newAccessToken,
          refreshToken: Cookies.get("refresh_token"),
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return axiosApi.request(originalRequest);
      } catch (error) {
        // Handle session expiration
        sessionExpire();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApi;
