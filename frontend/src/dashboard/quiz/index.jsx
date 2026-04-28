import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableLoader,
  TableHeader,
} from '@/ui/table';
import {
  Title,
  SearchBox,
  AddBtn,
  Filter,
} from '@/dashboard/shared/page-header';
import Alert from '@/ui/alert';
import Modal from '@/ui/modal';
import Paginate from '@/ui/paginate';
import { useGetItemsQuery, useRemoveMutation } from '@/redux/api/quiz-api';
import { BiTrash, BiEdit } from 'react-icons/bi';
import ConfirmDelete from '../shared/confirm-delete';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Radio from '../shared/filter/radio';
import debounce from 'lodash/debounce';
import Label from '../shared/filter/label';

import { Text } from '@/components/StyledComponents';
import { detectDirection } from '@/utils/detectDirection';
const initdata = {
  result: [],
  total: 0,
  page: 0,
  limit: 0,
  offset: 0,
  count: 0,
};
const tableHeaders = [
  { id: 'title', title: 'TITLE' },
  { id: 'type', title: 'TYPE' },
  { id: 'mark', title: 'MARK' },
  { id: 'status', title: 'STATUS' },
  { id: 'date', title: 'CREATED AT' },
  { id: 'action', title: 'ACTION' },
];

const Lessons = () => {
  const router = useRouter();
  const [remove, setRemove] = useState({ id: '', modal: false });
  const [filter, setFilter] = useState({ sort: 'desc', limit: 10 });
  const {
    data = initdata,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetItemsQuery({ params: filter });

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };
  const toggleRemoveModal = (id) => {
    setRemove((prev) => ({
      modal: !prev.modal,
      id,
    }));
  };

  const onDeleteSuccess = () => {
    toast.success('quiz deleted successfully');
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
    //console.log("name", name);
    //console.log("value", value);
  };

  const handleSearch = debounce((e) => {
    setFilter((prev) => {
      const temp = { ...prev };
      temp.title = e.target.value;
      return temp;
    });
  }, 800);

  const pathname = usePathname();
  return (
    // <div className="bg-white rounded-xl shadow-md p-4">
    <div className="">
      <Modal
        isOpen={remove.modal}
        toggle={toggleRemoveModal}
        className="max-w-xl"
      >
        <ConfirmDelete
          id={remove.id}
          toggleModal={toggleRemoveModal}
          description="are you sure you want to delete this quiz. this action can not be undo."
          title="Delete Quiz"
          onSuccess={onDeleteSuccess}
          onError={onDeleteError}
          useRemoveMutation={useRemoveMutation}
        />
      </Modal>
      <div className="lg:flex items-center justify-between mb-4">
        {/* page title */}
        <Title title="Quiz" subTitle={'All Quiz'} />
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          {/* search */}
          <SearchBox onChange={handleSearch} />
          {/* filter */}
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
                      checked={filter.sort === 'asc'}
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
                      checked={filter.sort === 'desc'}
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
          {/* add btn */}
          <div className="max-w-full">
            <AddBtn
              title="Add Quiz"
              onClick={() => {
                if (pathname.startsWith('/teacher')) {
                  router.push('/teacher/quiz/create');
                } else {
                  router.push('/admin/quiz/create');
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader cells={tableHeaders} />
          <TableBody>
            {isFetching ? (
              <TableLoader row={10} col={5} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert message={error?.data?.message ?? 'something wrong'} />
                </TableCell>
              </TableRow>
            ) : data.result.length ? (
              data.result.map((quiz) => {
                const quizTitleDirection = detectDirection(quiz.title);
                return (
                  <TableRow key={quiz._id}>
                    <TableCell>
                      <Text direction={quizTitleDirection}>
                        {quiz.title.length > 30
                          ? `${quiz.title.substring(0, 30)}...`
                          : quiz.title}
                      </Text>
                    </TableCell>
                    <TableCell>{quiz.type}</TableCell>
                    <TableCell>
                      <div className="text-center">{quiz.total_mark}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        {quiz.status ? (
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
                      {format(parseISO(quiz.createdAt), 'dd/MM/yyyy')}
                    </TableCell>

                    <TableCell>
                      <div className="flex">
                        <BiEdit
                          onClick={() => {
                            // router.push(`/admin/quiz/edit/${quiz._id}`);
                            if (pathname.startsWith('/teacher')) {
                              router.push(`/teacher/quiz/edit/${quiz._id}`);
                            } else {
                              router.push(`/admin/quiz/edit/${quiz._id}`);
                            }
                          }}
                          className="w-6 h-6 cursor-pointer text-gray-600 hover:text-green-300 transition-all"
                        />
                        <BiTrash
                          onClick={() => toggleRemoveModal(quiz._id)}
                          className="w-6 h-6 cursor-pointer text-gray-600 hover:text-red-400 transition-all"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableCell colSpan={6}>
                <Alert message="data not found" />
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

export default Lessons;
