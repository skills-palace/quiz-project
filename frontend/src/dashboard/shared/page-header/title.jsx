const title = ({ title, subTitle, className = "" }) => {
  return (
    <div className={className}>
      <h3 className="text-2xl font-medium text-gray-700">{title}</h3>
      <p className="text-xs text-gray-600">{subTitle}</p>
    </div>
  );
};

export default title;
