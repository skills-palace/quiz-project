import { useState } from "react";
import Item from "./item";
import { TableBottom } from "../shared/page-header";
import { BiPlus, BiSearch } from "react-icons/bi";
import Destroy from "./Destroy";
import Alert from "@/ui/alert";
import { useGetFilesQuery } from "@/redux/api/file-manager-api";

const Items = ({ setModal }) => {
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState({ page: 1, limit: 30 });
  const initData = { result: [], total: 0, limit: 30 };
  const {
    data = initData,
    isFetching,
    isError,
    error,
  } = useGetFilesQuery(filter);

  let delay;
  const textSearch = (text) => {
    clearTimeout(delay);
    delay = setTimeout(() => {
      setFilter((prev) => ({ ...prev, title: text }));
    }, 500);
  };

  const setSelect = (name) => {
    const idx = selected.indexOf(name);
    if (idx < 0) {
      setSelected([...selected, name]);
    } else {
      selected.splice(idx, 1);
      setSelected([...selected]);
    }
  };

  return (
    <div>
      <div className="flex sm:flex-row items-center justify-between mb-4">
        <div className="relative max-w-15">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <BiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            onChange={(e) => textSearch(e.target.value)}
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
        </div>
        <div>
          <div className="flex">
            {selected.length > 0 && (
              <Destroy ids={selected} setSelected={setSelected} />
            )}
            <button
              onClick={() => setModal(true)}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <BiPlus className="w-5 h-5 mr-2" />
              Add New
            </button>
          </div>
        </div>
      </div>
      <section className="overflow-hidden text-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
          {isFetching ? (
            Array.from({ length: 12 }).map((_, idx) => "<Skeleton key={idx} />")
          ) : isError ? (
            <Alert text={error?.data?.message ?? "something wrong"} />
          ) : data.result.length ? (
            data.result.map((item) => (
              <Item
                key={item._id}
                item={item}
                selectItem={selected}
                onChange={() => setSelect(item.name)}
              />
            ))
          ) : (
            <Alert message="file not found" />
          )}
        </div>

        <TableBottom data={data} filter={filter} setFilter={setFilter} />
      </section>
    </div>
  );
};

export default Items;
