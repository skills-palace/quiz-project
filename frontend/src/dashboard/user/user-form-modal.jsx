import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useCreateUserMutation,
  useUpdateMutation,
} from "@/redux/api/user-api";
import { BtnBlue, BtnWhite } from "@/dashboard/shared/btn";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const UserFormModal = ({ mode, initialUser, isOpen, onClose }) => {
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fname: "",
      lname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: 2,
      status: 1,
      subscriptionPlan: "explorer",
      explorerTrialEndsAt: "",
    },
  });

  const subscriptionPlan = watch("subscriptionPlan");

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && initialUser) {
      const trialSource =
        initialUser.trialEndsAt ?? initialUser.explorerTrialEndsAt ?? null;
      reset({
        fname: initialUser.fname ?? "",
        lname: initialUser.lname ?? "",
        username: initialUser.username ?? "",
        email: initialUser.email ?? "",
        password: "",
        confirmPassword: "",
        role: initialUser.role ?? 2,
        status:
          typeof initialUser.status === "number" ? initialUser.status : 1,
        subscriptionPlan: initialUser.subscriptionPlan ?? "explorer",
        explorerTrialEndsAt: toDatetimeLocalValue(trialSource),
      });
    } else if (mode === "create") {
      reset({
        fname: "",
        lname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: 2,
        status: 1,
        subscriptionPlan: "explorer",
        explorerTrialEndsAt: "",
      });
    }
  }, [isOpen, mode, initialUser, reset]);

  const onSubmit = async (data) => {
    if (mode === "create") {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      try {
        await createUser({
          fname: data.fname.trim(),
          lname: data.lname.trim(),
          username: data.username.trim(),
          email: data.email.trim(),
          password: data.password,
          role: Number(data.role),
          status: Number(data.status),
          subscriptionPlan: data.subscriptionPlan,
          explorerTrialEndsAt:
            data.subscriptionPlan === "learner"
              ? null
              : data.explorerTrialEndsAt?.trim() || undefined,
        }).unwrap();
        toast.success("User created successfully");
        onClose();
      } catch (err) {
        toast.error(err?.data?.message ?? "Could not create user");
      }
      return;
    }

    if (data.password || data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (data.password && String(data.password).length < 3) {
        toast.error("Password must be at least 3 characters");
        return;
      }
    }

    try {
      await updateUser({
        _id: initialUser._id,
        fname: data.fname.trim(),
        lname: data.lname.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        role: Number(data.role),
        status: Number(data.status),
        password: data.password || "",
        confirmPassword: data.password || "",
        subscriptionPlan: data.subscriptionPlan,
        explorerTrialEndsAt:
          data.subscriptionPlan === "learner"
            ? ""
            : data.explorerTrialEndsAt?.trim() ?? "",
      }).unwrap();
      toast.success("User updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message ?? "Could not update user");
    }
  };

  const busy = creating || updating;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 pb-6 pt-2 space-y-4 max-w-xl"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            type="text"
            className={inputClass}
            {...register("fname", {
              required: "First name is required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: 40,
            })}
          />
          {errors.fname && (
            <p className="mt-1 text-sm text-red-600">{errors.fname.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last name
          </label>
          <input
            type="text"
            className={inputClass}
            {...register("lname", {
              required: "Last name is required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: 40,
            })}
          />
          {errors.lname && (
            <p className="mt-1 text-sm text-red-600">{errors.lname.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          autoComplete="username"
          className={inputClass}
          {...register("username", {
            required: "Username is required",
            minLength: { value: 1, message: "Required" },
            maxLength: 80,
          })}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          autoComplete="email"
          className={inputClass}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select className={inputClass} {...register("role")}>
            <option value={1}>Admin</option>
            <option value={2}>Student</option>
            <option value={3}>Teacher</option>
            <option value={4}>Family</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select className={inputClass} {...register("status")}>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-4 py-3 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Membership</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Plan</label>
          <select className={inputClass} {...register("subscriptionPlan")}>
            <option value="explorer">Explorer (free trial tier)</option>
            <option value="learner">Learner (full access)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Learner clears the Explorer trial end date. Explorer can set when the
            trial ends (leave empty on create for default 1 week from signup).
          </p>
        </div>
        {subscriptionPlan === "explorer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Explorer trial ends at
            </label>
            <input
              type="datetime-local"
              className={inputClass}
              {...register("explorerTrialEndsAt")}
            />
            <p className="mt-1 text-xs text-gray-500">
              Edit: set a specific end time. Clear the field and save to remove the
              stored date (app may fall back to account creation + 7 days).
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-2">
          {mode === "create"
            ? "Set a password for the new account."
            : "Leave password blank to keep the current password."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {mode === "create" ? "Password" : "New password (optional)"}
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register("password", {
                validate: (v) => {
                  if (mode === "create") {
                    if (!v || String(v).length < 3) {
                      return "Password must be at least 3 characters";
                    }
                  }
                  return true;
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register("confirmPassword")}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <BtnWhite
          type="button"
          onClick={onClose}
          disabled={busy}
          className="px-4 py-2"
        >
          Cancel
        </BtnWhite>
        <BtnBlue type="submit" disabled={busy} className="px-4 py-2">
          {busy ? "Saving…" : mode === "create" ? "Create user" : "Save changes"}
        </BtnBlue>
      </div>
    </form>
  );
};

export default UserFormModal;
