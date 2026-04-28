const TableCell = ({ children, ...rest }) => {
  return (
    <td
      {...rest}
      className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-full"
    >
      {children}
    </td>
  );
};

export default TableCell;
