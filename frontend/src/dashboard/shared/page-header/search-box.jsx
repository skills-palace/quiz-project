import { BiSearch } from "react-icons/bi";

const SearchBox = ({ onChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <BiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="search"
        id="search"
        onChange={onChange}
        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBox;
