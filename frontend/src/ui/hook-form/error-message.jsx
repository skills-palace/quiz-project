import React from "react";

const ErrorMessage = ({ error }) => {
  return error ? (
    <p className="ml-1 mt-1 text-xs text-red-600 dark:text-red-500">
      {error.message}
    </p>
  ) : null;
};

export default ErrorMessage;
