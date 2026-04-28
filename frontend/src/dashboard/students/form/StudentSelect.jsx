import React from "react";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ReactSelect from "react-select";
import { useGetLearnersQuery } from "@/redux/api/user-api";
import toast from "react-hot-toast";

const StudentSelect = ({ control }) => {
  const [text, setText] = useState("");
  const { field } = useController({ name: "student", control: control });
  const { data, isLoading, error } = useGetLearnersQuery({ title: text });

  const inputChange = (inputValue) => {
    setText(inputValue);
  };
  useEffect(() => {
    if (error) {
      toast.error("error occured");
    }
  }, [error]);

  return (
    <ReactSelect
      {...field}
      onInputChange={inputChange}
      getOptionLabel={(opt) => opt.fname+" "+opt.lname}
      getOptionValue={(opt) => opt._id}
      options={data?.result ?? []}
      isLoading={isLoading}
    />
  );
};

export default StudentSelect;
