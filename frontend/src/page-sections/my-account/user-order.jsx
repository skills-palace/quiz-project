import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableHeaders,
  TableCell,
  TableRow,
  TableLoader,
  TableBottom,
} from "@/ui/table";
import Alert from "@/ui/alert";
import { useGetItemsQuery } from "@/redux/api/quiz-api";
import { BiTrash, BiEdit } from "react-icons/bi";

const UserOrder = () => {
  const router = useRouter();
  const [filter, setFilter] = useState({ page: 1 });

  const initdata = { result: [], total: 0, page: 0, limit: 0, offset: 0 };
  const {
    data = initdata,
    isFetching,
    isError,
    error,
  } = useGetItemsQuery(filter);

  const tableHeaders = [
    { id: "1", title: "TITLE" },
    { id: "2", title: "SUBJECT" },
    { id: "3", title: "GRADE" },
    { id: "4", title: "STATUS" },
    { id: "5", title: "ACTION" },
  ];

  const toggleRemoveModal = (id) => {
    setRemove((prev) => ({
      modal: !prev.modal,
      id,
    }));
  };

  return (
    <div className="">
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeaders cells={tableHeaders} />
          <TableBody>
            {isFetching ? (
              <TableLoader row={10} col={3} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert message={error?.data?.message ?? "something wrong"} />
                </TableCell>
              </TableRow>
            ) : data.result.length ? (
              data.result.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.subject}</TableCell>
                  <TableCell>{blog.grade}</TableCell>
                  <TableCell>{blog.grade}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <BiEdit
                        onClick={() =>
                          router.push(`/dashboard/blog/edit/${blog._id}`)
                        }
                        className="w-6 h-6 cursor-pointer text-gray-600 hover:text-green-300 transition-all"
                      />
                      <BiTrash
                        onClick={() => toggleRemoveModal(blog._id)}
                        className="w-6 h-6 cursor-pointer text-gray-600 hover:text-red-400 transition-all"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableCell colSpan={3}>
                <Alert message="no data found" />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </div>

      <TableBottom data={data} setFilter={setFilter} />
    </div>
  );
};

export default UserOrder;
