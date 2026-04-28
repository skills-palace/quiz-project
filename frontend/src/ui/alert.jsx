
const Alert= ({ message, className = "p-2 bg-red-200" }) => {
  return (
    <div className={className}>
      <p className="text-center text-red-600">{message}</p>
    </div>
  );
};

export default Alert;
