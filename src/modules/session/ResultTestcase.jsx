import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Wysiwyg from "@/components/reusables/Wysiwyg";
import { Badge } from "@/components/ui/badge";
import { MessageSquareIcon } from "lucide-react";

const ResultTestcase = ({ testcaseName, testcaseResult }) => {
  return (
    <div className="flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
      <div className="flex flex-row justify-between w-full">
        <h2>{testcaseName}</h2>
      </div>
      <Accordion className="w-full" type="single" collapsible>
        {testcaseResult?.data?.map((result, index) => {
          return (
            <AccordionItem key={index} value={index + 1}>
              <AccordionTrigger className="gap-2">
                <div className="flex justify-between grow">
                  <p>{result?.tester?.username}</p>
                  <div className="flex justify-between gap-2 items-center">
                    {result?.remarks ? <MessageSquareIcon size={18} /> : null}
                    <Badge className="w-14">
                      {result?.status?.charAt(0)?.toUpperCase() +
                        result?.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h4>Remarks</h4>
                <Wysiwyg
                  value={result?.remarks}
                  readOnly
                  className="bg-transparent border-none !p-0"
                  editableclassname="border-t-0 min-h-fit p-0"
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ResultTestcase;
