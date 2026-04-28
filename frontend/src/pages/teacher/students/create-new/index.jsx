import { useCreateUserMutation } from "@/redux/api/user-api"; // Update with the correct import path
import { BtnBlue } from "@/ui/btn";
import { Input, Label, Select } from "@/ui/hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import copy from "copy-to-clipboard";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons
import Layout from "@/layout/dashboard";

const Index = () => {
  const [createUser, { isLoading, isSuccess, isError, error }] =
    useCreateUserMutation();
  const dispatch = useDispatch();
  const { register, handleSubmit, control } = useForm();
  const router = useRouter();
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const onSubmit = async (formData) => {
    if (!formData.password) {
      formData.password = generatedPassword;
    }
    try {
      const result = await createUser(formData).unwrap();
      toast.success("Student added successfully");
    } catch (error) {
      toast.error("Failed to add student");
      console.error("Error adding student:", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // toast.success("Student added successfully");   // Handle success as needed
    }
  }, [isSuccess]);

  const generatePassword = () => {
    const newPassword = Math.random().toString(36).slice(-8);
    setGeneratedPassword(newPassword);
  };

  const copyToClipboard = () => {
    copy(generatedPassword);
    toast.success("Password copied to clipboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-0 m-0">
      <div className="min-h-[25px] mb-1 flex flex-col justify-center">
        {isError && (
          <p className="text-sm text-red-500 bg-red-100 px-2 rounded">
            {error?.data?.message ?? "Something went wrong"}
          </p>
        )}
      </div>

      <div className="mb-2">
        <Label>First Name</Label>
        <input className="w-full rounded" type="text" {...register("fname")} />
      </div>
      <div className="mb-2">
        <Label>Last Name</Label>
        <input className="w-full rounded" type="text" {...register("lname")} />
      </div>

      <div className="mb-2">
        <Label>Email</Label>
        <input className="w-full rounded" type="email" {...register("email")} />
      </div>
      <div className="mb-2">
        <Label>Password</Label>
        <div className="flex items-center">
          <Input
            type={showPassword ? "text" : "password"} // Toggle input type
            {...register("password")}
            value={generatedPassword}
            onChange={(e) => setGeneratedPassword(e.target.value)}
          />  <button
          type="button"
          onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
          className="ml-2 p-2"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="text-xl" />
          ) : (
            <AiOutlineEye className="text-xl" />
          )}
        </button>
          <button
            type="button"
            onClick={generatePassword}
            className="ml-2 p-2 bg-blue-500 text-white rounded"
          >
            Generate
          </button>
          {generatedPassword && (
            <button
              type="button"
              onClick={copyToClipboard}
              className="ml-2 p-2 bg-green-500 text-white rounded"
            >
              Copy
            </button>
          )}
        
        </div>
      </div>
      <div className="mb-2">
        <Label>Account Type</Label>
        <select className="w-full rounded" {...register("role")}>
          <option value="2">student</option>
        </select>
      </div>
      <BtnBlue type="submit" className="block rounded w-full px-5 py-2.5 mt-4">
        {isLoading ? "Wait..." : "Add Student"}
      </BtnBlue>
    </form>
  );
};

Index.Layout = Layout;
export default Index;
