import { useState } from "react";
import SectionHead from "@/components/shared/SectionHead";
import {
  useGetItemsQuery,
  useCreateMutation,
  useUpdateMutation,
} from "@/redux/api/learn-group-api";
import Modal from "@/components/modal";
import Form from "../../../dashboard/learnGroup/form";
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
import { setgroups } from "process";
function Index() {
  const [modal, setModal] = useState(false);
  const {
    data = {},
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetItemsQuery();
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState(false);
  const [group, setGroup] = useState({});
  const [editModal, setEditModal] = useState(false);
  const tableHeaders = [
    { id: "name", title: "Group Name" },
    { id: "total", title: "Total Student" },
    { id: "grade", title: "Description" },
    { id: "action", title: "Action" },
  ];
  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const destroy = (itemId) => {
    setId(itemId);
    setDeleteModal(true);
  };

  const handleModal = () => {
    setModal(!modal);
  };
  const handleEditModal = () => {
    setEditModal(false);
  };

  const edit = (item) => {
    setGroup(item);
    setEditModal(true);
  };

  // Add a default value for pageSize
  const pageSize = data.pageSize || 10;

  return (
    <>
      <Modal isOpen={deleteModal} close={handleDeleteModal}>
        <Destroy id={id} close={handleDeleteModal} />
      </Modal>
      <Modal isOpen={editModal} close={handleEditModal}>
        <Form
          title="Edit Group"
          defaultValues={group}
          close={handleEditModal}
          useMutation={useUpdateMutation}
        />
      </Modal>
      <Modal isOpen={modal} close={handleModal}>
        <Form
          title="Add Group"
          defaultValues={{
            name: "",
            description: "",
          }}
          close={handleModal}
          useMutation={useCreateMutation}
        />
      </Modal>

      <SectionHead
        title={"Your Group"}
        subTitle={`You have total ${data.total ?? 0} groups`}
      >
        <div className="dash-block-tools g-3">
          {/* <FilterData query={filter} setQuery={setFilter} /> */}
        </div>
        <button className="p-2 rounded bg-skin-primary" onClick={handleModal}>
          Add
        </button>
      </SectionHead>

      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader cells={tableHeaders} />
          <TableBody>
            {isFetching ? (
              <TableLoader row={10} col={5} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert message={error?.data?.message ?? "something wrong"} />
                </TableCell>
              </TableRow>
            ) : data.result.length ? (
              data.result.map((group) => (
                <TableRow key={group._id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.total_student}</TableCell>
                  <TableCell>
                    <div className="text-center">{group.description}</div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => edit(group)}
                        className="btn btn-dim btn-icon btn-sm btn-success"
                      >
                        <BiShow className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => destroy(group._id)}
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
    </>
  );
}

Index.Layout = Layout;
export default Index;
