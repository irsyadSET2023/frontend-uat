import React from "react";
import { NavLink } from "react-router-dom";
import AvatarProfile from "./AvatarProfile";

const NAV = [
  {
    link: "/app",
    text: "Projects",
  },
  {
    link: "/app/members",
    text: "Members",
  },
];

const Header = () => {
  return (
    <div className="sticky top-0 bg-white flex flex-row justify-between items-center w-full py-[24px] px-[32px] border-b-[1px] border-[#E4E4E7]">
      <div className="flex flex-row justify-start items-center gap-[47px]">
        <NavLink
          to="/app"
          className="text-[#18181B] text-[24px] font-[600] tracking-[-0.6px] leading-[32px] cursor-pointer"
        >
          nextest
        </NavLink>
        <div className="flex flex-row justify-start items-start gap-[24px]">
          {NAV.map((link, index) => (
            <NavLink key={index} to={link.link}>
              <p className={getTabStyle(link.link)}>{link.text}</p>
            </NavLink>
          ))}
        </div>
      </div>
      <AvatarProfile />
    </div>
  );
};

const getTabStyle = (tabLink) => {
  const currentPath = window.location.pathname;
  const isActive = currentPath === tabLink;
  const linkColor = isActive ? "text-primary" : "text-muted-foreground";
  const linkStyling = "hover:cursor-pointer small font-medium " + linkColor;
  return linkStyling;
};
export default Header;
