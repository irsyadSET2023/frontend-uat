import React, { useState } from "react";
import ChecklistHeader from "@/components/reusables/ChecklistHeader";
import useGetResultChecklistApi from "@/utils/hooks/session/useGetResultChecklistApi";
import pluralize from "pluralize";
import DataTable from "@/components/reusables/DataTable";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { createColumnHelper } from "@tanstack/react-table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ResultTestcase from "./ResultTestcase";
import useViewResultTestcaseApi from "@/utils/hooks/session/useViewResultTestcaseApi";

const ResultChecklist = () => {
  const params = useParams();

  const { data: checklistResultData, loadingState } = useGetResultChecklistApi({
    sessionId: params.sessionId,
  });

  const columnHelper = createColumnHelper();

  const columnResultChecklist = [
    columnHelper.accessor("scenario", {
      header: "Scenarios",
      cell: (cell) => {
        const data = cell?.row?.original;
        const totalFailedTestcase = data?.testcases?.filter(
          (testcase) => testcase.failCount !== 0
        ).length;

        return (
          <>
            <AccordionItem
              className="border-b-0"
              value={data?.scenario?.toLowerCase()?.replaceAll(" ", "-")}
            >
              <AccordionTrigger className="gap-2 p-0">
                <div className="flex justify-between items-center grow">
                  <div className="flex flex-row items-center gap-2">
                    <p className="font-medium">{data?.scenario}</p>
                    <Badge variant="outline">
                      {pluralize("testcase", data?.testcases?.length, true)}
                    </Badge>
                  </div>
                  {totalFailedTestcase === 0 ? null : (
                    <Badge variant="destructive">
                      {pluralize("failed testcase", totalFailedTestcase, true)}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="mt-4">
                {data?.testcases?.map((testcase) => {
                  const { data: testcaseResult, handleViewResultTestcase } =
                    useViewResultTestcaseApi({
                      sessionId: params.sessionId,
                      testcaseId: testcase?.id,
                    });
                  const [open, setOpen] = useState(false);
                  return (
                    <Sheet key={testcase.id} open={open} onOpenChange={setOpen}>
                      <SheetTrigger
                        onClick={handleViewResultTestcase}
                        className="w-full p-4 flex justify-between border-b border-t -mb-[1px] hover:underline"
                      >
                        <div className="space-x-2">
                          {testcase.name}
                          <Badge variant="outline">
                            {testcase?.type?.charAt(0).toUpperCase() +
                              testcase?.type?.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex gap-1 flex-nowrap">
                          <Badge>Passed: {testcase.passCount}</Badge>
                          <Badge variant="destructive">
                            Failed: {testcase.failCount}
                          </Badge>
                        </div>
                      </SheetTrigger>
                      <SheetContent enableFullscreen fullscreen={true}>
                        <ResultTestcase
                          open={open}
                          testcaseName={testcase?.name}
                          testcaseResult={testcaseResult}
                        />
                      </SheetContent>
                    </Sheet>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </>
        );
      },
    }),
  ];

  return (
    <>
      <ChecklistHeader />

      <div className="flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
        <div className="flex flex-row justify-between w-full">
          <div className="flex gap-2">
            <Link to={`/app/projects/${params.id}/sessions`}>
              <Button variant="outline">
                <ArrowLeft size={18} /> Sessions
              </Button>
            </Link>
            <h2>{checklistResultData?.checklistName}</h2>
          </div>
        </div>
        <div className="w-full">
          <Accordion type="multiple">
            <DataTable
              data={checklistResultData}
              columns={columnResultChecklist}
              disablePagination={true}
              loadingState={loadingState}
            />
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default ResultChecklist;
