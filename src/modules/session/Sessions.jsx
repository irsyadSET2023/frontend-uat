import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ChecklistHeader from "@/components/reusables/ChecklistHeader";
import CreateBox from "@/components/reusables/CreateBox";
import SessionDrawer from "./SessionDrawer";
import DataTable from "@/components/reusables/DataTable";
import { createColumnHelper } from "@tanstack/table-core";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Presentation } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectContext";
import useGetSessionApi from "@/utils/hooks/session/useGetSessionApi";
import { useChecklistContext } from "@/context/ChecklistContext";

const Sessions = () => {
  const { projectId } = useProjectContext();
  const {
    data: checklistData,
    setPageInfo,
    initialized,
  } = useChecklistContext();
  const {
    data: sessionData,
    handleGetSessions,
    fetchSessionState,
  } = useGetSessionApi({
    projectId,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialized.current) setPageInfo({ page: null, pageSize: null });
  }, []);

  const columnHelper = createColumnHelper();

  const columnsChecklist = [
    columnHelper.accessor("uniqueId", {
      header: "Session ID",
      cell: (cell) => {
        const location = useLocation();
        const data = cell.row.original;
        return (
          <Link
            className="whitespace-nowrap hover:underline"
            to={`${location.pathname}/result/${data?.id}`}
          >
            {cell.getValue()}
          </Link>
        );
      },
      size: 0,
    }),
    columnHelper.accessor("name", {
      header: "Checklists",

      cell: (cell) => {
        const data = cell.row.original;
        return (
          <div className="flex gap-2">
            <p variant="outline">{data?.checklist?.name}</p>
            <Badge
              className="capitalize h-fit mt-0.5"
              variant={data?.status === "locked" ? "destructive" : ""}
            >
              {data?.status}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.accessor("index", {
      header: "",
      cell: (cell) => {
        const navigate = useNavigate();
        const [editOpen, setEditOpen] = useState(false);
        const sessionId = cell.row.original.id;
        const checklistName = cell.row.original.checklist.name;
        const filteredSessionData = sessionData.find(
          (item) => item.id === sessionId
        );

        return (
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <div className="flex justify-center items-center">
              <Presentation
                onClick={
                  filteredSessionData.status === "public"
                    ? () => navigate(String(sessionId))
                    : null
                }
                className={`${
                  filteredSessionData.status === "locked"
                    ? "muted hover:cursor-not-allowed"
                    : "hover:cursor-pointer"
                }`}
                strokeWidth={1}
                absoluteStrokeWidth
              />
              <SheetTrigger asChild>
                <Button variant="ghost" className="cursor-pointer px-2">
                  <MoreHorizontal size={16} />
                </Button>
              </SheetTrigger>
              <SessionDrawer
                open={editOpen}
                setOpen={setEditOpen}
                checklistName={checklistName}
                id={sessionId}
                refetch={handleGetSessions}
                data={checklistData}
              />
            </div>
          </Sheet>
        );
      },
      size: 0,
    }),
  ];
  return (
    <>
      <ChecklistHeader />
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
          <div className="flex flex-row justify-between w-full">
            <h2>Sessions</h2>
            <SheetTrigger asChild>
              <Button className="py-[8px] px-[16px] small text-[#FAFAFA]">
                New session
              </Button>
            </SheetTrigger>
          </div>
          <div className="text-left self-start">
            <p>Click on a session ID to view submission result.</p>
          </div>
          {fetchSessionState === "loading" || sessionData?.length > 0 ? (
            <DataTable
              columns={columnsChecklist}
              data={sessionData}
              disablePagination={true}
              loadingState={fetchSessionState}
            />
          ) : (
            <SheetTrigger className="w-full">
              <CreateBox styling={"underline hover:cursor-pointer"}>
                <>Start creating new session</>
              </CreateBox>
            </SheetTrigger>
          )}
          <SessionDrawer
            open={open}
            setOpen={setOpen}
            refetch={handleGetSessions}
            data={checklistData}
          />
        </div>
      </Sheet>
    </>
  );
};

export default Sessions;
