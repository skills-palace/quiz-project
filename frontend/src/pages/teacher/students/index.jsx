import { useState } from "react";
import SectionHead from "@/components/shared/SectionHead";

import Pagination from "rc-pagination";
import { useGetItemsQuery } from "@/redux/api/learner-api";
import Modal from "@/components/modal";
import AddStudent from "./Add";
import EditStudent from "./Edit";
import Destroy from "./Destroy";
import Layout from "@/layout/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableLoader,
  TableRow,
} from "@/ui/table";
import Alert from "@/ui/alert";
import { BiShow, BiTrash } from "react-icons/bi";
function Index() {
  const [addmodal, setAddModal] = useState(false);
  const [editmodal, setEditModal] = useState(false);
  const [student, setStudent] = useState({});

  const { data = {}, isError, isFetching, error } = useGetItemsQuery();

  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState(false);

  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const destroy = (itemId) => {
    console.log("id", itemId);
    setId(itemId);
    setDeleteModal(true);
  };

  const handleAddModal = () => setAddModal(!addmodal);
  const handlEditModal = () => setEditModal(!editmodal);

  const edit = (item) => {
    setStudent(item);
    handlEditModal();
  };
  const tableHeaders = [
    { id: "name", title: "Student Name" },
    { id: "code", title: "Student Code" },
    { id: "grade", title: "Student grade" },
    { id: "action", title: "Action" },
  ];
  const pageSize = data.pageSize || 10;
  return (
    <>
      <Modal isOpen={deleteModal} close={handleDeleteModal}>
        <Destroy id={id} close={handleDeleteModal} />
      </Modal>
      <Modal isOpen={addmodal} close={handleAddModal}>
        <AddStudent close={handleAddModal} />
      </Modal>
      <Modal isOpen={editmodal} close={handlEditModal}>
        <EditStudent close={handlEditModal} data={student} />
      </Modal>

      <SectionHead
        title={"Students"}
        subTitle={`You have total ${data.total ?? 0}  student`}
      >
        <div className="dash-block-tools g-3">
          {/* <FilterData query={filter} setQuery={setFilter} /> */}
        </div>
        <button
          className="p-2 rounded bg-skin-primary"
          onClick={handleAddModal}
        >
          Add
        </button>
      </SectionHead>

      <div className="dash-block">
        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader cells={tableHeaders} />
            <TableBody>
              {isFetching ? (
                <TableLoader row={10} col={5} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Alert
                      message={error?.data?.message ?? "something wrong"}
                    />
                  </TableCell>
                </TableRow>
              ) : data.result.length ? (
                data.result.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.student?.fname}</TableCell>
                    <TableCell>{student.code}</TableCell>
                    <TableCell>
                      <div className="text-center">{student.grade}</div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => edit(student)}
                          className="btn btn-dim btn-icon btn-sm btn-success"
                        >
                          <BiShow className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => destroy(student._id)}
                          className="btn btn-dim btn-icon btn-sm btn-danger text-red-500"
                        >
                          <BiTrash className="action-icon" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableCell colSpan={6}>
                  <Alert message="data not found" />
                </TableCell>
              )}
            </TableBody>
          </Table>
        </div>

        {data.result && (
          <div className="card">
            <div className="card-inner">
              <div className="pagination-box">
                <Pagination
                  prefixCls="my_pagination"
                  onChange={(current) =>
                    setFilter({
                      ...filter,
                      page: current,
                    })
                  }
                  pageSize={pageSize}
                  total={data.total}
                  page={data.page}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Index.Layout = Layout;
export default Index;
