import React from "react";
import { BiAward, BiUser, BiUserPlus, BiTestTube } from "react-icons/bi";
import { useDashboardHomeQuery } from "@/redux/api/app-api";
const AdminHome = () => {
  const { data, isFetching, isError, error } = useDashboardHomeQuery();

  if (isFetching) return <p>loadig....</p>;
  if (isError) return <p>something wrong</p>;

  const users = data.result;

  const userType = {
    1: "Admin",
    2: "Student",
    3: "Teacher",
    4: "Family",
  };

  console.log("user", users);

  return (
    <div className="flex gap-3">
      <div className="w-32 h-32 bg-gray-200 rounded shadow flex flex-col justify-center items-center">
        <BiAward className="w-8 h-8" />
        <p className="my-1 font-medium">Admin</p>
        <p className="font-semibold">
          {users.find((user) => user._id === 1)?.total ?? 0}
        </p>
      </div>
      <div className="w-32 h-32 bg-gray-200 rounded shadow flex flex-col justify-center items-center">
        <BiTestTube className="w-8 h-8" />
        <p className="my-1 font-medium">Teacher</p>
        <p className="font-semibold">
          {users.find((user) => user._id === 3)?.total ?? 0}
        </p>
      </div>
      <div className="w-32 h-32 bg-gray-200 rounded shadow flex flex-col justify-center items-center">
        <BiUserPlus className="w-8 h-8" />
        <p className="my-1 font-medium">Family</p>
        <p className="font-semibold">
          {users.find((user) => user._id === 4)?.total ?? 0}
        </p>
      </div>
      <div className="w-32 h-32 bg-gray-200 rounded shadow flex flex-col justify-center items-center">
        <BiUser className="w-8 h-8" />
        <p className="my-1 font-medium">User</p>
        <p className="font-semibold">
          {users.find((user) => user._id === 2)?.total ?? 0}
        </p>
      </div>
    </div>
  );
};

export default AdminHome;
