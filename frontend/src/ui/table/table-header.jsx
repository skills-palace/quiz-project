const TableHeaders = ({
  cells,
  className = "text-xs font-semibold text-gray-500 border-b border-gray-200",
}) => {
  return (
    <thead className={className}>
      <tr>
        {cells.map((cell) => (
          <th
            key={cell.id}
            className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          >
            <div className="font-semibold text-left">{cell.title}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaders;
