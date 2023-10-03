import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import CreateBox from "@/components/reusables/CreateBox";
import TesterHeader from "@/components/reusables/TesterHeader";
import { createColumnHelper } from "@tanstack/table-core";
import { ClipboardCheck, Loader2, MoreHorizontal } from "lucide-react";
import DataTable from "@/components/reusables/DataTable";
import { Badge } from "@/components/ui/badge";
import TesterDrawer from "./TesterDrawer";
import useGetTesterSessionApi from "@/utils/hooks/tester/useGetTesterSessionApi";
import { useNavigate } from "react-router";

const TesterDashboard = () => {
  const [open, setOpen] = useState(false);
  const {
    data: testerData,
    handleGetTesterSession,
    fetchSessionState,
  } = useGetTesterSessionApi({
    onSuccess: () => {
      setOpen(false);
    },
  });
  const navigate = useNavigate();

  const columnHelper = createColumnHelper();

  const columnsChecklist = [
    columnHelper.accessor("uniqueId", {
      header: "Id",
      cell: (cell) => <p className="whitespace-nowrap">{cell.getValue()}</p>,
      size: 0,
    }),
    columnHelper.accessor("organizationName", {
      header: "Organization",
      cell: (cell) => <p className="whitespace-nowrap">{cell.getValue()}</p>,
      size: 0,
    }),
    columnHelper.accessor("name", {
      header: "Checklist",

      cell: (cell) => {
        const data = cell?.row?.original;

        return (
          <div className="flex gap-2">
            <p className="whitespace-nowrap" variant="outline">
              {data?.checklistName}
            </p>
            <Badge
              className="capitalize h-fit mt-1"
              variant={
                cell?.row?.original?.status === "locked" ? "destructive" : ""
              }
            >
              {cell?.row?.original?.status}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.accessor("index", {
      header: "",
      cell: (cell) => {
        const sessionId = cell?.row?.original?.id;
        const filteredTesterData = testerData.find(
          (item) => item.id === sessionId
        );
        const selectedId = filteredTesterData?.id;
        const selectedUniqueId = filteredTesterData?.uniqueId;
        const selectedChecklistName = filteredTesterData?.checklistName;
        const [editOpen, setEditOpen] = useState(false);

        return (
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <div className="flex justify-end items-center">
              {filteredTesterData.status === "public" && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/tester/session/${sessionId}`)}
                >
                  <ClipboardCheck strokeWidth={1.5} />
                  <p className="w-fit h-fit whitespace-nowrap small font-[400]">
                    Start session
                  </p>
                </Button>
              )}
              <SheetTrigger asChild>
                <Button variant="ghost" className="cursor-pointer px-2">
                  <MoreHorizontal size={16} />
                </Button>
              </SheetTrigger>
              <TesterDrawer
                open={editOpen}
                setOpen={setEditOpen}
                id={selectedId}
                checklistName={selectedChecklistName}
                refetch={handleGetTesterSession}
                uniqueId={selectedUniqueId}
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
      <TesterHeader />
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="h-max flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
          <div className="flex flex-row justify-between w-full">
            <h2>Sessions</h2>
            <SheetTrigger asChild>
              <Button className="py-[8px] px-[16px] small text-[#FAFAFA]">
                Join a session
              </Button>
            </SheetTrigger>
          </div>

          {fetchSessionState === "loading" || testerData?.length > 0 ? (
            <DataTable
              columns={columnsChecklist}
              data={testerData}
              disablePagination={true}
              loadingState={fetchSessionState}
            />
          ) : (
            <SheetTrigger className="w-full">
              <CreateBox styling={"underline hover:cursor-pointer"}>
                {"Start joining session"}
              </CreateBox>
            </SheetTrigger>
          )}
          <TesterDrawer
            open={open}
            setOpen={setOpen}
            refetch={handleGetTesterSession}
          />
        </div>
      </Sheet>
    </>
  );
};

export default TesterDashboard;
