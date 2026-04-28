import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, useSession, getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { BtnBlue } from "@/dashboard/shared/btn";
import { ErrorMessage, Label, Input } from "@/ui/hook-form";
import Link from "next/link";
import { setAuth } from "@/redux/slices/app-slice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { resetExplorerTrialBannerVisibility } from "@/lib/explorer-trial-session";

const LoginForm = ({ redirect = "/", message }) => {
  const { data: session, status } = useSession();
  const init = {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  };

  const [userStatus, setUserStatus] = useState(init);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: {} });
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    setUserStatus({ ...init, isLoading: true });
    const email = String(formData?.email ?? "").trim();
    const password = String(formData?.password ?? "");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      toast.error(result.error || "Login failed");
      setUserStatus({
        ...init,
        isLoading: false,
        isError: true,
        error: result.error,
      });
    } else {
      // signIn() does not return accessToken; session is populated async — sync cookies from JWT.
      let session = await getSession();
      if (!session?.user?.accessToken) {
        await new Promise((r) => setTimeout(r, 150));
        session = await getSession();
      }
      const at = session?.user?.accessToken;
      const rt = session?.user?.refreshToken;
      if (at) Cookies.set("access_token", at, { expires: 1 });
      if (rt) Cookies.set("refresh_token", rt, { expires: 30 });
      resetExplorerTrialBannerVisibility();
      setUserStatus({
        ...init,
        isLoading: false,
        isSuccess: true,
        data: result,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { redirect: false });
  };

  const handleFacebookSignIn = async () => {
    await signIn("facebook", { redirect: false });
  };

  useEffect(() => {
    if (status === "authenticated") {
      const r = session?.user?.result;
      const auth = {
        username: r?.fname,
        subscriptionPlan: r?.subscriptionPlan,
        explorerTrialEndsAt: r?.explorerTrialEndsAt,
      };
      Cookies.set("access_token", session?.user?.accessToken, { expires: 1 });
      Cookies.set("refresh_token", session?.user?.refreshToken, {
        expires: 30,
      }); // 30 days

      localStorage.setItem("auth", JSON.stringify(auth));
      dispatch(setAuth({ status: "auth", user: auth }));
      toast.success("Login successful");
      if (
        !redirect ||
        (redirect === "/" && session?.user?.result?.role === 3)
      ) {
        window.location.href = "/teacher";
      } else window.location.href = redirect;
    }
  }, [status, session, dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-[25px] mb-1 flex flex-col justify-center">
        {message && (
          <p className="text-sm text-red-500 bg-red-100 px-2 rounded">
            {message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="your@mail.com"
          invalid={errors.email}
          register={register("email", { required: "Email is required" })}
        />
        <ErrorMessage error={errors.email} />
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          invalid={errors.password}
          register={register("password", { required: "Password is required" })}
        />
        <ErrorMessage error={errors.password} />
      </div>

      <BtnBlue type="submit" className="block rounded w-full px-5 py-2.5">
        {status === "loading" ? "Loading" : "Sign in"}
      </BtnBlue>
      <p className="text-sm mt-2 font-light text-gray-500">
        Don’t have an account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-primary-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            className="w-4 h-4 mr-2 svg-inline--fa fa-google fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8c0-17.7-1.5-35-4.4-51.8H250v98h134.3c-5.8 31.1-23.1 57.6-49 75.2v62.4h79.4c46.5-42.8 73.3-105.8 73.3-183.8zM250 500c68 0 124.7-22.7 166.2-61.6l-79.4-62.4c-22.2 15-50.6 24.4-86.7 24.4-66.6 0-122.9-45-143.1-105.4H12.6v66.1C54.7 453.1 147.3 500 250 500zM105.3 315.1c-4.7-13.9-7.4-28.6-7.4-43.1s2.7-29.2 7.4-43.1v-66.1H12.6C4.7 197 0 223.1 0 250s4.7 53 12.6 77.1l92.7-12zM250 119.8c36.1 0 68.5 12.5 94.2 36.5l69.2-69.2C362.2 48.9 308.3 24 250 24 147.3 24 54.7 70.9 12.6 154.1L105.3 216c20.2-60.4 76.5-105.4 143.1-105.4z"
            ></path>
          </svg>
          Sign in with Google
        </button>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleFacebookSignIn}
          className="w-full text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="facebook"
            className="w-4 h-4 mr-2 svg-inline--fa fa-facebook fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.5 90.5 225.9 209 240v-168h-63v-72h63v-56c0-63.6 38-98.6 95.6-98.6 27.6 0 56.4 5 56.4 5v62h-31.8c-31.3 0-41 19.4-41 39v47h69.7l-11 72h-58.7V496c118.5-14.1 209-116.5 209-240z"
            ></path>
          </svg>
          Sign in with Facebook
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
