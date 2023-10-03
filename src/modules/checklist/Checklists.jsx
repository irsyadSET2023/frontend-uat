import ChecklistHeader from "@/components/reusables/ChecklistHeader";
import React, { useEffect, useRef, useState } from "react";
import ScenarioDrawer from "../scenario/ScenarioDrawer";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CreateBox from "@/components/reusables/CreateBox";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useScenarioContext } from "@/context/ScenarioContext";
import { useChecklistContext } from "@/context/ChecklistContext";
import { useProjectContext } from "@/context/ProjectContext";
import DndTable from "@/components/reusables/DndTable";
import GroupBadges from "@/components/reusables/GroupBadges";
import useSwapScenarioApi from "@/utils/hooks/scenario/useSwapScenarioApi";
import useProjectPermission from "@/utils/hooks/auth/usePermission";

const columnHelper = createColumnHelper();

const columnsChecklist = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (cell) => {
      const location = useLocation();
      const scenarioId = cell?.row?.original?.id;
      const scenarioPath = `${location.pathname}/${scenarioId}`;

      return (
        <Link to={scenarioPath} className="hover:underline">
          <p className="whitespace-nowrap">{cell.getValue()}</p>
        </Link>
      );
    },
    size: 0,
  }),
  columnHelper.accessor("test_cases", {
    header: "Test cases",
    cell: (cell) => {
      const testCases = cell.row.original?.test_cases || [];
      return (
        <div className="flex gap-2">
          {testCases.length === 0 && (
            <p className="text-muted-foreground whitespace-nowrap">
              No test case
            </p>
          )}
          {testCases.length > 0 && (
            <GroupBadges array={testCases} maxLength={3} />
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor("id", {
    header: "",
    cell: (cell) => {
      const [open, setOpen] = useState(false);
      const data = cell.row.original;
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="cursor-pointer px-2">
              <MoreHorizontal size={16} />
            </Button>
          </SheetTrigger>
          <ScenarioDrawer open={open} setOpen={setOpen} id={data.id} />
        </Sheet>
      );
    },
    size: 0,
  }),
];

const Checklists = ({ disabled }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useProjectContext();
  const {
    checklistId,
    data: checklist,
    fetchChecklistState,
  } = useChecklistContext();
  const filteredChecklist = checklist?.data?.find(
    (item) => item.id === parseInt(checklistId)
  );
  const initial = useRef(true);
  const { handleSwapScenario } = useSwapScenarioApi({
    projectId,
    checklistId,
  });
  const { scenarios, scenarioLoading } = useScenarioContext();
  const [scenarioData, setScenarioData] = useState([]);
  const canEdit = useProjectPermission();
  const isEmpty = scenarios?.length === 0;

  useEffect(() => {
    if (scenarioData.length === 0) return;
    if (initial.current) {
      initial.current = false;
      return;
    }

    handleSwapScenario(scenarioData.map((item) => item.id));
  }, [scenarioData]);

  useEffect(() => {
    setScenarioData(scenarios);
  }, [scenarios]);
  return (
    <>
      <ChecklistHeader projectData={[]} disabled={disabled} />
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="h-screen flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
          <div className="flex flex-row justify-between w-full">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/app/projects/${projectId}`)}
              >
                <ArrowLeft size={18} /> Checklist
              </Button>
              <h2>{filteredChecklist?.name}</h2>
            </div>
            <SheetTrigger disabled={!canEdit} asChild>
              <Button className="py-[8px] px-[16px] small text-[#FAFAFA]">
                New scenario
              </Button>
            </SheetTrigger>
          </div>

          {isEmpty ? (
            <SheetTrigger disabled={!canEdit} asChild>
              <CreateBox className="underline hover:cursor-pointer">
                Start creating a new scenario
              </CreateBox>
            </SheetTrigger>
          ) : (
            <DndTable
              columns={columnsChecklist}
              data={scenarioData}
              setData={setScenarioData}
              disabled={!canEdit}
              loadingState={fetchChecklistState}
            />
          )}
        </div>

        <ScenarioDrawer open={open} setOpen={setOpen} />
      </Sheet>
    </>
  );
};

export default Checklists;
