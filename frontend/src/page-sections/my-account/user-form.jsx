import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/redux/api/user-api";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

const UserForm = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const hasToken =
    mounted && typeof Cookies.get === "function" && !!Cookies.get("access_token");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMeQuery(undefined, {
      skip: !hasToken,
    });

  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fname: "",
      lname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const user = data?.result;

  useEffect(() => {
    if (!user) return;
    reset({
      fname: user.fname ?? "",
      lname: user.lname ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      password: "",
      confirmPassword: "",
    });
  }, [user, reset]);

  const onSubmit = async (formData) => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await updateProfile({
        fname: formData.fname?.trim() ?? "",
        lname: formData.lname?.trim() ?? "",
        username: formData.username?.trim() ?? "",
        email: formData.email?.trim() ?? "",
        password: formData.password || "",
        confirmPassword: formData.confirmPassword || "",
      }).unwrap();
      toast.success("Profile updated successfully");
      reset({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err?.data?.message ?? "Could not update profile");
    }
  };

  if (!mounted) {
    return (
      <p className="text-gray-600" aria-hidden>
        Loading…
      </p>
    );
  }

  if (!hasToken) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-6 text-center text-amber-900">
        <p className="mb-3 font-medium">Sign in to view and edit your account.</p>
        <Link
          href="/login?redirect=/my-account"
          className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <p className="text-gray-600" aria-busy="true">
        Loading your profile…
      </p>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-red-800">
        <p className="mb-2">
          {error?.data?.message ?? "Could not load your profile."}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-semibold underline"
          >
            Try again
          </button>
          <Link
            href="/login?redirect=/my-account"
            className="text-sm font-semibold underline"
          >
            Sign in again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-3xl flex-col"
      noValidate
    >
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          My account
        </h1>
        <p className="mt-2 text-gray-600">
          Update your name, username, email, or password. Leave password fields
          empty to keep your current password.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fname"
            className="block text-sm font-medium text-gray-700"
          >
            First name
          </label>
          <input
            id="fname"
            type="text"
            className={inputClass}
            {...register("fname", { maxLength: 40 })}
          />
        </div>
        <div>
          <label
            htmlFor="lname"
            className="block text-sm font-medium text-gray-700"
          >
            Last name
          </label>
          <input
            id="lname"
            type="text"
            className={inputClass}
            {...register("lname", { maxLength: 40 })}
          />
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          className={inputClass}
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div className="mt-6">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Optional. Minimum 3 characters if you change it.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register("password", {
                validate: (v) =>
                  !v ||
                  String(v).length >= 3 ||
                  "At least 3 characters if changing password",
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register("confirmPassword")}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
