import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableLoader,
  TableHeader,
} from "@/ui/table";
import {
  Title,
  SearchBox,
  AddBtn,
  Filter,
} from "@/dashboard/shared/page-header";
import Alert from "@/ui/alert";
import Modal from "@/ui/modal";
import Paginate from "@/ui/paginate";
import { useGetItemsQuery, useRemoveMutation } from "@/redux/api/user-api";
import { BiTrash, BiEdit } from "react-icons/bi";
import ConfirmDelete from "../shared/confirm-delete";
import toast from "react-hot-toast";
import Radio from "../shared/filter/radio";
import debounce from "lodash/debounce";
import Label from "../shared/filter/label";
import UserFormModal from "./user-form-modal";

const initdata = {
  result: [],
  total: 0,
  page: 0,
  limit: 0,
  offset: 0,
  count: 0,
};
const TABLE_COL_COUNT = 7;

const tableHeaders = [
  { id: "email", title: "EMAIL" },
  { id: "username", title: "USERNAME" },
  { id: "account", title: "ACCOUNT" },
  { id: "plan", title: "PLAN" },
  { id: "membership", title: "MEMBERSHIP" },
  { id: "status", title: "STATUS" },
  { id: "action", title: "ACTION" },
];

function formatTrialEndLabel(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(iso);
  }
}

function MembershipCells({ user }) {
  const plan = user.subscriptionPlan ?? "explorer";
  const trialEndsAt = user.trialEndsAt ?? user.explorerTrialEndsAt ?? null;

  if (plan === "learner") {
    return (
      <>
        <TableCell>
          <div className="text-center">
            <span className="bg-violet-200 text-violet-800 px-2 py-1 rounded text-xs font-semibold">
              Learner
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-center text-xs text-gray-600">Full access</div>
        </TableCell>
      </>
    );
  }

  const end = trialEndsAt ? new Date(trialEndsAt).getTime() : 0;
  const active = end > Date.now();

  return (
    <>
      <TableCell>
        <div className="text-center">
          <span className="bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-semibold">
            Explorer
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-center text-xs">
          {!trialEndsAt ? (
            <span className="text-gray-500">No trial end date</span>
          ) : active ? (
            <>
              <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                Trial active
              </span>
              <div className="text-gray-600 mt-1">
                until {formatTrialEndLabel(trialEndsAt)}
              </div>
            </>
          ) : (
            <>
              <span className="inline-block bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium">
                Trial ended
              </span>
              <div className="text-gray-500 mt-1">
                {formatTrialEndLabel(trialEndsAt)}
              </div>
            </>
          )}
        </div>
      </TableCell>
    </>
  );
}

const Users = () => {
  const [remove, setRemove] = useState({ id: "", modal: false });
  const [filter, setFilter] = useState({ sort: "desc", limit: 10, page: 1 });
  const [userForm, setUserForm] = useState({
    open: false,
    mode: "create",
    user: null,
  });

  const {
    data = initdata,
    isFetching,
    isError,
    error,
  } = useGetItemsQuery({ params: filter });

  const openUserForm = (mode, user = null) => {
    setUserForm({ open: true, mode, user });
  };

  const closeUserForm = () => {
    setUserForm({ open: false, mode: "create", user: null });
  };

  const toggleRemoveModal = (id) => {
    setRemove((prev) => ({
      modal: !prev.modal,
      id: id !== undefined ? id : prev.id,
    }));
  };

  const accountType = {
    1: (
      <span className="bg-cyan-200 text-cyan-700 px-2 py-1 rounded">admin</span>
    ),
    2: (
      <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded">
        student
      </span>
    ),
    3: (
      <span className="bg-sky-200 text-sky-700 px-2 py-1 rounded">teacher</span>
    ),
    4: (
      <span className="bg-indigo-200 text-indigo-700 px-2 py-1 rounded">
        family
      </span>
    ),
  };

  const onDeleteSuccess = () => {
    toast.success("User deleted successfully");
    toggleRemoveModal();
  };

  const onDeleteError = ({ message }) => {
    toast.error(message);
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => {
      const temp = { ...prev };
      temp[name] = value;
      return temp;
    });
  };

  const handleSearch = debounce((e) => {
    setFilter((prev) => {
      const temp = { ...prev };
      temp.email = e.target.value;
      temp.page = 1;
      return temp;
    });
  }, 800);

  return (
    <div className="">
      <Modal
        isOpen={remove.modal}
        toggle={() => toggleRemoveModal()}
        className="max-w-xl"
      >
        <ConfirmDelete
          id={remove.id}
          toggleModal={() => toggleRemoveModal()}
          description="Are you sure you want to delete this user? This action cannot be undone."
          title="Delete user"
          onSuccess={onDeleteSuccess}
          onError={onDeleteError}
          useRemoveMutation={useRemoveMutation}
        />
      </Modal>

      <Modal
        isOpen={userForm.open}
        toggle={closeUserForm}
        className="max-w-2xl"
        title={userForm.mode === "create" ? "Add user" : "Edit user"}
      >
        <UserFormModal
          mode={userForm.mode}
          initialUser={userForm.user}
          isOpen={userForm.open}
          onClose={closeUserForm}
        />
      </Modal>

      <div className="lg:flex items-center justify-between mb-4">
        <Title title="Users" subTitle="All users" />
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <SearchBox onChange={handleSearch} />
          <Filter>
            <div className="mt-2">
              <h6 className="mb-2 px-2 pt-2 text-sm font-medium text-gray-900">
                Orderby
              </h6>
              <ul className="text-sm font-medium border text-gray-900 bg-white">
                <li className="w-full border-b border-gray-200">
                  <div className="flex items-center pl-3">
                    <Radio
                      name="sort"
                      onChange={handleFilter}
                      value="asc"
                      checked={filter.sort === "asc"}
                      id="order-asc"
                    />
                    <Label title="ascending" htmlFor="order-asc" />
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <Radio
                      name="sort"
                      onChange={handleFilter}
                      value="desc"
                      checked={filter.sort === "desc"}
                      id="order-dsc"
                    />
                    <Label title="descending" htmlFor="order-dsc" />
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-0">
              <h6 className="mb-2 px-2 pt-2 text-sm font-medium text-gray-900">
                Limit Per Page
              </h6>
              <ul className="text-sm font-medium border text-gray-900 bg-white">
                <li className="w-full border-b border-gray-200">
                  <div className="flex items-center pl-3">
                    <Radio
                      name="limit"
                      onChange={handleFilter}
                      value="10"
                      checked={filter.limit == 10}
                      id="page-10"
                    />
                    <Label title="10 per page" htmlFor="page-10" />
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <Radio
                      name="limit"
                      onChange={handleFilter}
                      value="20"
                      checked={filter.limit == 20}
                      id="page-20"
                    />
                    <Label title="20 per page" htmlFor="page-20" />
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <Radio
                      name="limit"
                      onChange={handleFilter}
                      value="30"
                      checked={filter.limit == 30}
                      id="page-30"
                    />
                    <Label title="30 per page" htmlFor="page-30" />
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <Radio
                      name="limit"
                      onChange={handleFilter}
                      value="40"
                      checked={filter.limit == 40}
                      id="page-40"
                    />
                    <Label title="40 per page" htmlFor="page-40" />
                  </div>
                </li>
              </ul>
            </div>
          </Filter>
          <div className="max-w-full">
            <AddBtn title="Add User" onClick={() => openUserForm("create")} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader cells={tableHeaders} />
          <TableBody>
            {isFetching ? (
              <TableLoader row={10} col={TABLE_COL_COUNT} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={TABLE_COL_COUNT}>
                  <Alert message={error?.data?.message ?? "something wrong"} />
                </TableCell>
              </TableRow>
            ) : data.result.length ? (
              data.result.map((user) => (
                <TableRow key={user._id}>
                  <TableCell style={{ width: "0%" }}>{user.email}</TableCell>
                  <TableCell style={{ width: "100%" }}>
                    {user.username}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">{accountType[user.role]}</div>
                  </TableCell>
                  <MembershipCells user={user} />
                  <TableCell>
                    <div className="text-center">
                      {user.status ? (
                        <span className="bg-green-200 text-green-700 px-2 py-1 rounded">
                          active
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          inactive
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label="Edit user"
                        className="p-0 border-0 bg-transparent"
                        onClick={() => openUserForm("edit", user)}
                      >
                        <BiEdit className="w-6 h-6 cursor-pointer text-gray-600 hover:text-green-300 transition-all" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete user"
                        className="p-0 border-0 bg-transparent"
                        onClick={() => {
                          setRemove({ modal: true, id: user._id });
                        }}
                      >
                        <BiTrash className="w-6 h-6 cursor-pointer text-gray-600 hover:text-red-400 transition-all" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableCell colSpan={TABLE_COL_COUNT}>
                <Alert message="no data found" />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </div>

      <Paginate
        data={data}
        onChange={(current) =>
          setFilter((prev) => ({
            ...prev,
            page: current,
          }))
        }
      />
    </div>
  );
};

export default Users;
