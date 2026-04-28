const Input = ({ register, invalid, className, ...rest }) => {
  return (
    <input
      {...rest}
      {...register}
      aria-invalid={invalid ? "true" : "false"}
      className={["input-text", className].filter(Boolean).join(" ")}
    />
  );
};

export default Input;
