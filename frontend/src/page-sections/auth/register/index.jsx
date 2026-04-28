import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import Cookies from "js-cookie";
import useRegister from "@/auth/useRegister";
import { BtnBlue } from "@/ui/btn";
import { Input, Label, Select } from "@/ui/hook-form";
import Link from "next/link";
import { setAuth } from "@/redux/slices/app-slice";

const Register = () => {
  const [registerNow, { data, isLoading, isSuccess, isError, error }] =
    useRegister();

  const dispatch = useDispatch();
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      fname: "",
      lname: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "2",
    },
  });
  const router = useRouter();
  const { data: session, status } = useSession();

  const onSubmit = (formData) => {
    registerNow(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Register successfully");
      const r = data.result;
      const auth = {
        username: r.fname,
        subscriptionPlan: r.subscriptionPlan,
        explorerTrialEndsAt: r.explorerTrialEndsAt,
      };
      localStorage.setItem("auth", JSON.stringify(auth));
      dispatch(setAuth({ status: "auth", user: auth }));
      // router.replace("/");

      window.location.href = "/";
    }
  }, [isSuccess, data, dispatch, router]);

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
      });
      localStorage.setItem("auth", JSON.stringify(auth));
      dispatch(setAuth({ status: "auth", user: auth }));
      toast.success("Login successful");
      router.push("/");
      if (session?.user?.result?.role === 3) {
        window.location.href = "/teacher";
      } else window.location.href = '/';
    }
  }, [status, session, dispatch, router]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-0 m-0"
      autoComplete="off"
    >
      <div className="min-h-[25px] mb-1 flex flex-col justify-center">
        {isError && (
          <p className="text-sm text-red-500 bg-red-100 px-2 rounded">
            {error?.data?.message ?? "Something went wrong"}
          </p>
        )}
      </div>

      <div className="mb-2">
        <Label>First Name</Label>
        <Input
          type="text"
          register={register("fname")}
          autoComplete="given-name"
        />
      </div>
      <div className="mb-2">
        <Label>Last Name</Label>
        <Input
          type="text"
          register={register("lname")}
          autoComplete="family-name"
        />
      </div>
      <div className="mb-2">
        <Label htmlFor="username">User Name</Label>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value.toLowerCase().replace(/\W+/g, "-")
                )
              }
              type="text"
              id="username"
              autoComplete="off"
            />
          )}
        />
      </div>
      <div className="mb-2">
        <Label>Email</Label>
        <Input
          type="email"
          register={register("email")}
          autoComplete="email"
        />
      </div>
      <div className="mb-2">
        <Label>Password</Label>
        <Input
          type="password"
          register={register("password")}
          autoComplete="new-password"
        />
      </div>
      <div className="mb-2">
        <Label>Confirm Password</Label>
        <Input
          type="password"
          register={register("confirm_password")}
          autoComplete="new-password"
        />
      </div>
      <div className="mb-2">
        <Label>Account Type</Label>
        <Select register={register("role")}>
          <option value="2">Student</option>
         {/* <option value="3">Teacher</option>
          <option value="4">Family</option>
          */} 
        </Select>
      </div>
      <BtnBlue className="block rounded w-full px-5 py-2.5 mt-4">
        {isLoading ? "Wait..." : "Sign Up"}
      </BtnBlue>
      <p className="text-sm font-light mt-2 text-gray-500">
        Already have an account?
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:underline ml-1"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default Register;
