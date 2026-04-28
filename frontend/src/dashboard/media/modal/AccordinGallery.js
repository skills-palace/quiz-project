import { useState, useEffect } from "react";
import { BtnBlue } from "@/dashboard/shared/btn";
import Item from "../item";
import { TableBottom } from "@/dashboard/shared/page-header";
import { BiPlus, BiSearch } from "react-icons/bi";
import Alert from "@/ui/alert";
import { useGetFilesQuery } from "@/redux/api/file-manager-api";

function AccordinGallery({ type, values = [], onChange }) {
  console.log("onChangle", onChange);
  const [selected, setSelected] = useState(values);
  const [filter, setFilter] = useState({ page: 1, limit: 30 });
  const initData = { result: [], total: 0, limit: 30 };
  const {
    data = initData,
    isFetching,
    isError,
    error,
  } = useGetFilesQuery(filter);

  const handleChange = (name) => {
    if (type === "multiple") {
      const idx = selected.indexOf(name);
      if (idx < 0) {
        setSelected([...selected, name]);
      } else {
        selected.splice(idx, 1);
        setSelected([...selected]);
      }
    } else {
      setSelected([name]);
    }
  };

  const setFile = () => {
    if (type === "multiple") {
      onChange(selected);
    } else {
      onChange(selected[0]);
    }
  };

  // useEffect(() => {
  //   if (values) {
  //     setSelected(values);
  //   }
  // }, []);

  console.log("selected", selected);

  return (
    <div className="">
      <div className="flex sm:flex-row items-center justify-between mb-4">
        <div className="relative max-w-15">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <BiSearch className="w-5 h-5 text-gray-500" />
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
        <div className="text-end">
          <BtnBlue
            disabled={selected.length === 0}
            onClick={setFile}
            type="button"
          >
            add selected
          </BtnBlue>
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
                onChange={() => handleChange(item.name)}
              />
            ))
          ) : (
            <Alert text="no media found" />
          )}
        </div>

        <TableBottom data={data} filter={filter} setFilter={setFilter} />
      </section>
    </div>
  );
}

export default AccordinGallery;
