import { useEffect, useState } from "react";

type IAuth = {
  status: "idle" | "auth" | "noAuth";
  user: any;
};

export default function useAuth() {
  const [auth, setAuth] = useState<IAuth>({ status: "idle", user: {} });

  // console.time("isCookie");
  // const userAuth =
  //   typeof window !== "undefined" &&
  //   document.cookie.match(new RegExp("(^| )auth=([^;]+)"))?.at(2);
  // console.timeEnd("isCookie");

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const parseAuth: any = JSON.parse(auth);
        setAuth({ status: "auth", user: { username: parseAuth.username } });
      } catch (error) {
        setAuth({ status: "noAuth", user: {} });
      }
    } else {
      setAuth({ status: "noAuth", user: {} });
    }
  }, []);

  return { auth, setAuth };
  // }
}
