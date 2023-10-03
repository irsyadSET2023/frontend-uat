import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AvatarProfile from "./AvatarProfile";
import { useAuthContext } from "@/context/AuthContext";
import { useProjectContext } from "@/context/ProjectContext";
import { useChecklistContext } from "@/context/ChecklistContext";

const ChecklistHeader = ({ disabled }) => {
  const navigate = useNavigate();

  const { account } = useAuthContext();
  const { projects: projectData, projectId } = useProjectContext();
  const { setPageInfo } = useChecklistContext();

  const NAV = [
    {
      link: "/app/projects/" + projectId,
      text: "Checklists",
    },
    {
      link: "/app/projects/" + projectId + "/sessions",
      text: "Sessions",
    },
    account.roles === "owner"
      ? {
          link: "/app/projects/" + projectId + "/settings",
          text: "Settings",
        }
      : {},
  ];

  const handleNavigate = async (value) => {
    const projectId = String(value);
    setPageInfo({ page: 1, pageSize: 10 });
    navigate("/app/projects/" + projectId);
  };

  return (
    <div
      key={projectId}
      className="bg-white sticky top-0 flex flex-row justify-between items-center w-full py-[24px] px-[32px] border-b-[1px] border-[#E4E4E7] z-10"
    >
      <div className="flex flex-row justify-start items-center gap-[47px]">
        <NavLink
          to="/app"
          className="text-[#18181B] text-[24px] font-[600] tracking-[-0.6px] leading-[32px] cursor-pointer"
        >
          nextest
        </NavLink>
        <div className="flex flex-row justify-start items-center gap-[24px]">
          <Select
            onValueChange={handleNavigate}
            defaultValue={parseInt(projectId) || null}
            disabled={disabled}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="No project assigned" />
            </SelectTrigger>
            <SelectContent>
              {projectData.map((item, index) => (
                <SelectItem key={index} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {NAV.map((link, index) => (
            <NavLink
              className={
                disabled ? "pointer-events-none" : "pointer-events-auto"
              }
              key={index}
              to={link.link}
            >
              <p
                className={
                  disabled ? "text-muted-foreground" : getTabStyle(link.link)
                }
              >
                {link.text}
              </p>
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
export default ChecklistHeader;
