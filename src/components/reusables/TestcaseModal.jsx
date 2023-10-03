import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import Wysiwyg from "./Wysiwyg";
import ImageTile from "./ImageTile";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const TestcaseModal = ({
  name,
  type,
  description,
  stepDetails,
  expectedResults,
  screenshots,
}) => {
  const buttonStyle1 =
    "flex p-4 flex-col items-center gap-[12px] flex-1 border-[2px] border-[#F4F4F5] h-[80px] w-full text-white hover:cursor-default hover:text-white";
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <p className="font-[600]">{name}</p>
          <Badge
            variant={type === "positive" ? null : "destructive"}
            className={type === "positive" ? "bg-[#60d394]" : null}
          >
            {type === "positive" ? "Positive" : "Negative"}
          </Badge>
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div>
        <Label>Description</Label>
        <p className="cursor-default">{description}</p>
      </div>
      <div>
        <Label>Step Details</Label>
        <Wysiwyg
          value={stepDetails}
          readOnly
          className="bg-transparent border-none !p-0"
          editableclassname="border-t-0 min-h-fit p-0"
        />
      </div>
      <div>
        <Label>Expected Results</Label>
        <Wysiwyg
          value={expectedResults}
          readOnly
          className="bg-transparent border-none !p-0"
          editableclassname="border-t-0 min-h-fit p-0"
        />
      </div>
      {screenshots && (
        <div>
          <Label>Screenshots</Label>
          <ImageTile src={screenshots} />
        </div>
      )}
    </DialogContent>
  );
};

export default TestcaseModal;
