import React from "react";
import { FaUser } from "react-icons/fa";
import { HiSun } from "react-icons/hi";
import { RiSettings3Fill } from "react-icons/ri";

const Navbar = () => {
  return (
    <div
      className="relative nav flex items-center justify-between
      px-4 sm:px-6 md:px-[100px]
      h-[70px] md:h-[90px]
      border-b border-gray-800"
    >
      <h3
        className="
          absolute left-1/4 -translate-x-1/2
          md:static md:translate-x-0
          text-[20px] sm:text-[22px] md:text-[25px]
          font-[700] sp-text
        "
      >
        GenUI
      </h3>

      <div className="icons flex items-center gap-3 sm:gap-4 md:gap-[15px] ml-auto">
        <div className="icon text-[18px] sm:text-[20px] cursor-pointer">
          <HiSun />
        </div>
        <div className="icon text-[18px] sm:text-[20px] cursor-pointer">
          <FaUser />
        </div>
        <div className="icon text-[18px] sm:text-[20px] cursor-pointer">
          <RiSettings3Fill />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
