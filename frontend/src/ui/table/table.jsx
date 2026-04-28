const Table = ({ children, className = "w-full" }) => {
  return <table className={`table-auto overflow-x-auto ${className}`}>{children}</table>;
};

export default Table;
