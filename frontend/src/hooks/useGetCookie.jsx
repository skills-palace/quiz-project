import { useEffect, useRef, useState } from "react";
// import {
//   getCookies,
//   getCookie,
//   setCookie,
//   deleteCookie,
//   hasCookie,
// } from "cookies-next";

export default function useAuth() {
  const [auth, setAuth] = useState({ status: "idle", user: {} });

  console.time("isCookie");
  const userAuth =
    typeof window !== "undefined" &&
    document.cookie.match(new RegExp("(^| )auth=([^;]+)"))?.at(2);
  console.timeEnd("isCookie");

  useEffect(() => {
    if (userAuth) {
      // try {
      //console.log("userAuth", JSON.parse(userAuth));
      setAuth({ status: "auth" });
      //  } catch (error) {
      //setAuth({ status: "noAuth" });
      // }
    } else {
      setAuth({ status: "noAuth" });
    }
  }, [userAuth]);

  return auth;
  // }
}
