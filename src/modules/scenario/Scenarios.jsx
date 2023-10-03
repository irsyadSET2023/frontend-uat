import ChecklistHeader from "@/components/reusables/ChecklistHeader";
import React, { useEffect, useRef, useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CreateBox from "@/components/reusables/CreateBox";
import TestcaseDrawer from "../testcase/TestcaseDrawer";
import DndTable from "@/components/reusables/DndTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGetTestcaseApi from "@/utils/hooks/testcase/useGetTestcaseApi";
import { useProjectContext } from "@/context/ProjectContext";
import { useScenarioContext } from "@/context/ScenarioContext";
import { useChecklistContext } from "@/context/ChecklistContext";
import useSwapTestcaseApi from "@/utils/hooks/testcase/useSwapTestcaseApi";
import useProjectPermission from "@/utils/hooks/auth/usePermission";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TestcaseModal from "@/components/reusables/TestcaseModal";

const Scenarios = ({ disabled }) => {
  const { projectId } = useProjectContext();
  const { checklistId } = useChecklistContext();
  const { scenarioId, scenarios } = useScenarioContext();
  const {
    data,
    handleGetTestCase: refetch,
    loadingState,
  } = useGetTestcaseApi({
    projectId,
    scenarioId,
  });
  const navigate = useNavigate();
  const initial = useRef(true);
  const [testCaseData, setTestCaseData] = useState(data);
  const { handleSwapTestcase } = useSwapTestcaseApi({
    projectId,
    scenarioId,
  });
  const [open, setOpen] = useState(false);
  const canEdit = useProjectPermission();

  const columnHelper = createColumnHelper();
  const columnsScenario = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => {
        const viewData = cell.row.original;
        return (
          <Dialog>
            <DialogTrigger>
              <p className="whitespace-nowrap hover:cursor-pointer hover:underline">
                {cell.getValue()}
              </p>
            </DialogTrigger>
            <TestcaseModal
              name={viewData.name}
              type={viewData.type}
              description={viewData.description}
              stepDetails={viewData.stepDetails}
              expectedResults={viewData.expectedResults}
              screenshots={viewData.screenshots}
            />
          </Dialog>
        );
      },
      size: 0,
    }),
    columnHelper.accessor("type", {
      header: "Testing Type",
      cell: (cell) => {
        return (
          <div className="flex gap-2">
            {cell.getValue() === "positive" ? (
              <Badge>Positive</Badge>
            ) : (
              <Badge variant="destructive">Negative</Badge>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (cell) => {
        const data = cell.row.original;
        const [copyOpen, setCopyOpen] = useState(false);
        const [editOpen, setEditOpen] = useState(false);
        return (
          <div className="flex items-center">
            {canEdit && (
              <Sheet open={copyOpen} onOpenChange={setCopyOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="cursor-pointer px-2">
                    <Copy size={16} />
                  </Button>
                </SheetTrigger>
                <TestcaseDrawer
                  id={data.id}
                  duplicate
                  open={copyOpen}
                  setOpen={setCopyOpen}
                  refetch={refetch}
                />
              </Sheet>
            )}
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="cursor-pointer px-2">
                  <MoreHorizontal size={16} />
                </Button>
              </SheetTrigger>
              <TestcaseDrawer
                id={data.id}
                open={editOpen}
                setOpen={setEditOpen}
                refetch={refetch}
              />
            </Sheet>
          </div>
        );
      },
      size: 0,
    }),
  ];

  useEffect(() => {
    if (testCaseData.length === 0) return;
    if (initial.current) {
      initial.current = false;
      return;
    }

    handleSwapTestcase(testCaseData.map((item) => item.id));
  }, [testCaseData]);

  useEffect(() => {
    setTestCaseData(data);
  }, [data]);

  return (
    <>
      <ChecklistHeader disabled={disabled} />
      <Dialog>
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="h-screen flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
            {!disabled && (
              <div className="flex flex-row justify-between w-full">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/app/projects/${projectId}/${checklistId}`)
                    }
                  >
                    <ArrowLeft size={18} /> Scenario
                  </Button>
                  <h2>
                    {scenarios.find((scenario) => {
                      return String(scenario.id) === scenarioId;
                    })?.name || "No title found"}
                  </h2>
                </div>
                <SheetTrigger disabled={!canEdit} asChild>
                  <Button
                    disabled={!canEdit}
                    className="py-[8px] px-[16px] small text-[#FAFAFA]"
                  >
                    New test case
                  </Button>
                </SheetTrigger>
              </div>
            )}
            {data.length > 0 ? (
              <DndTable
                columns={columnsScenario}
                data={testCaseData}
                setData={setTestCaseData}
                className="self-stretch"
                disabled={!canEdit}
                loadingState={loadingState}
              />
            ) : (
              <SheetTrigger className="w-full">
                <CreateBox styling="underline hover:cursor-pointer">
                  New test case
                </CreateBox>
              </SheetTrigger>
            )}
          </div>
          <TestcaseDrawer
            id={null}
            setOpen={setOpen}
            open={open}
            refetch={refetch}
          />
        </Sheet>
      </Dialog>
    </>
  );
};

export default Scenarios;
