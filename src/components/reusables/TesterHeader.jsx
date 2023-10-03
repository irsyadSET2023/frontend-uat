import React from "react";
import { NavLink } from "react-router-dom";
import AvatarProfile from "./AvatarProfile";
import { Badge } from "../ui/badge";

const TesterHeader = () => {
  return (
    <div className="sticky top-0 bg-white flex flex-row justify-between items-center w-full py-[24px] px-[32px] border-b-[1px] border-[#E4E4E7]">
      <div className="flex flex-row justify-start items-center gap-[47px]">
        <NavLink
          to="/tester/session"
          className="flex flex-row items-center justify-center gap-[8px] text-[#18181B] text-[24px] font-[600] tracking-[-0.6px] leading-[32px] cursor-pointer"
        >
          nextest
          <Badge>tester</Badge>
        </NavLink>
      </div>
      <AvatarProfile />
    </div>
  );
};

export default TesterHeader;
