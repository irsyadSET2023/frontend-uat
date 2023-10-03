import Header from "@/components/reusables/Header";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ProjectDrawer from "./ProjectDrawer";
import CreateBox from "../../components/reusables/CreateBox";
import ProjectCards from "./ProjectCards";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import useGetProjectApi from "@/utils/hooks/project/useGetProjectApi";

const Projects = () => {
  const [open, setOpen] = useState(false);
  const { account, getAccount } = useAuthContext();
  const navigate = useNavigate();
  const { data, handleGetAllProject } = useGetProjectApi({
    onSuccess: (resData) => {
      if (account?.roles === "admin" && resData.length > 0) {
        navigate(`/app/projects/${String(resData[0].id)}`);
      } else if (account?.roles === "admin") {
        navigate(`/app/projects`);
      }
    },
    onError: () => {
      if (account?.roles === "admin") {
        navigate(`/app/projects`);
      }
    },
  });
  return (
    <>
      <Header />
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
          <div className="flex flex-row justify-between w-full">
            <h2>Projects</h2>
            <SheetTrigger asChild>
              <Button className="py-[8px] px-[16px] small text-[#FAFAFA]">
                New Project
              </Button>
            </SheetTrigger>
          </div>
          {data.length === 0 && (
            <SheetTrigger className="w-full">
              <CreateBox
                children="Start creating a new project"
                styling="underline hover:cursor-pointer"
              />
            </SheetTrigger>
          )}
          <ProjectDrawer
            refetch={() => {
              getAccount();
              handleGetAllProject();
              setOpen(false);
            }}
          />
          <ProjectCards data={data} />
        </div>
      </Sheet>
    </>
  );
};

export default Projects;
