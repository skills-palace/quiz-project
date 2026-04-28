import Paginate from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";

function TableBottom({
  data,
  onChange,
  className = "p-2 my-4 shadow bg-white rounded-md",
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="">
        <span className="text-sm text-gray-700">
          Showing
          <span className="font-semibold text-gray-900 mx-1">
            {data.offset}
          </span>
          to
          <span className="font-semibold text-gray-900 mx-1">
            {data.offset + data.count}
          </span>
          of
          <span className="font-semibold text-gray-900 mx-1">{data.total}</span>
          Entries
        </span>
      </div>
      <Paginate
        // prefixCls="rc-paginate"
        className="dash-paginate"
        onChange={onChange}
        locale={locale}
        pageSize={data.limit}
        total={data.total}
        current={data.page}
      />
    </div>
  );
}

export default TableBottom;
