import ChecklistHeader from "@/components/reusables/ChecklistHeader";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MOCK_PROJECTS } from "../DATA";

const Settings = ({ disabled, title, subtitle, children }) => {
  const navigate = useNavigate();
  const params = useParams();
  const selectedId = params?.id;

  const NAV = [
    {
      link: "/app/projects/" + selectedId + "/settings",
      text: "Project",
    },
    {
      link: "/app/projects/" + selectedId + "/settings/admin",
      text: "Admin",
    },
  ];
  const DATA = MOCK_PROJECTS;
  return (
    <>
      <ChecklistHeader projectData={DATA} disabled={disabled} />
      <div className="py-[24px] px-[32px] h-full">
        <div className="space-y-2">
          <h3 className="font-[700]">Settings</h3>
          <p className="muted text-[16px]">
            Manage project settings and admin preferences.
          </p>
        </div>
        <div>
          <Separator className="mt-[24px]" />
          <div className="flex flex-row py-[16px] gap-[48px]">
            <div className="flex flex-col text-left">
              {NAV.map((link, index) => (
                <Button
                  variant="ghost"
                  className="w-[250px] h-[40px] justify-start"
                  key={index}
                  onClick={() => navigate(link.link)}
                >
                  {link.text}
                </Button>
              ))}
            </div>
            <div className="grow">
              <h3 className="large font-[500]">{title}</h3>
              <p className="muted text-[14px] font-[400]">{subtitle}</p>
              <Separator className="my-[24px]" />
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
