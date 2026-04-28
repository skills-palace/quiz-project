import { BiMenuAltLeft } from "react-icons/bi";
import UserMenu from "./user-menu";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between h-12 mx-2">
        <div className="flex gap-2">
          <div onClick={toggleSidebar} className="text-2xl">
            <BiMenuAltLeft />
          </div>
          {/* <div className="text-2xl">
            <BiSearch />
          </div> */}
        </div>
        <div className="flex items-center min-w-[120px]">
          {/* <div className="text-2xl mr-2">
            <BiCog />
          </div> */}
          {/* admin dropdown */}
          <UserMenu />
          {/* admin dropdown */}
        </div>
      </div>
    </header>
  );
};

export default Header;
