import React from "react";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import ReactSelect from "react-select";
import { useGetLearnersQuery } from "@/redux/api/user-api";

const StudentSelect = ({ control }) => {
  const [text, setText] = useState("");
  const { field } = useController({ name: "students", control });
  const { data, isLoading } = useGetLearnersQuery({ title: text });
  

  const inputChange = (inputValue) => {
    setText(inputValue);
  };

  return (
    <ReactSelect
      {...field}
      isMulti
      onInputChange={inputChange}
      getOptionLabel={(opt) => opt.fname+" "+opt.lname}
      getOptionValue={(opt) => opt._id}
      options={data?.result ?? []}
      isLoading={isLoading}
    />
  );
};

export default StudentSelect;
