import React from "react";
import TableRow from "./table-row";
import TableCell from "./table-cell";

const TableLoader = ({ row = 2, col = 2, barHeight = 20 }) => {
  const rows = [...Array(row)];
  const cols = [...Array(col)];

  return (
    <>
      {rows.map((_, i) => (
        <TableRow key={i}>
          {cols.map((_, j) => (
            <TableCell key={j}>
              <div className="animate-pulse">
                <div
                  style={{ height: barHeight }}
                  className="bg-gray-200 dark:bg-gray-700"
                ></div>
                <span className="sr-only">Loading...</span>
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableLoader;
