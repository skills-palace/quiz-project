import React from "react";

const Textarea = ({ register, error, ...rest }) => {
  return (
    <>
      <textarea
        {...register}
        {...rest}
        rows="4"
        className={`${
          error
            ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500"
            : "bg-gray-50 border-gray-300 focus:border-blue-500"
        } block p-2.5 w-full text-sm bg-gray-50 rounded-lg border  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      ></textarea>
      {error && (
        <p className="ml-1 mt-1 text-xs text-red-600 dark:text-red-500">
          {error.message}
        </p>
      )}
    </>
  );
};

export default Textarea;
