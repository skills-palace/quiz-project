import React from "react";
import {
  FaFacebookSquare,
  FaYoutube,
  FaTwitterSquare,
  FaTelegram,
} from "react-icons/fa";
import { BiPhone, BiMessageSquareDetail } from "react-icons/bi";

const Topbar = () => {
  return (
    <div className="bg-gray-600 py-2">
      <div className="container">
        <div className="flex justify-between text-white px-2">
          <div className="flex gap-2">
            <div className="flex">
              <BiPhone className="w-5 h-5 mr-1" />
              <span className="text-sm">+9932323232</span>
            </div>
            <div className="flex">
              <BiMessageSquareDetail className="w-5 h-5 mr-1" />
              <span className="text-sm">demo@gmail.com</span>
            </div>
          </div>
          {/* <div className="flex gap-1">
            <FaFacebookSquare className="w-5 h-5" />
            <FaYoutube className="w-5 h-5" />
            <FaTwitterSquare className="w-5 h-5" />
            <FaTelegram className="w-5 h-5" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
