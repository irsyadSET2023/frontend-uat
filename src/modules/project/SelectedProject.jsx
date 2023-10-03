import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ChecklistHeader from "@/components/reusables/ChecklistHeader";
import CreateBox from "@/components/reusables/CreateBox";
import ChecklistTable from "../checklist/ChecklistTable";
import ChecklistDrawer from "../checklist/ChecklistDrawer";
import useProjectPermission from "@/utils/hooks/auth/usePermission";

const SelectedProject = ({ disabled = false }) => {
  const [open, setOpen] = useState(false);
  const canEdit = useProjectPermission();

  return (
    <>
      <ChecklistHeader disabled={disabled} />
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="h-max flex flex-col items-center gap-[16px] px-[32px] pt-[24px] pb-[32px]">
          <div className="flex flex-row justify-between w-full">
            <h2>Checklists</h2>
            <SheetTrigger disabled={disabled || !canEdit} asChild>
              <Button
                disabled={disabled || !canEdit}
                className="py-[8px] px-[16px] small text-[#FAFAFA]"
              >
                New checklist
              </Button>
            </SheetTrigger>
          </div>

          {disabled && (
            <SheetTrigger disabled={disabled} className="w-full">
              <CreateBox
                styling={disabled ? "" : "underline hover:cursor-pointer"}
              >
                <>
                  {disabled
                    ? "No project assigned"
                    : "Start creating a new checklist!"}
                </>
              </CreateBox>
            </SheetTrigger>
          )}
          <ChecklistDrawer setOpen={setOpen} />
          {!disabled && <ChecklistTable />}
        </div>
      </Sheet>
    </>
  );
};

export default SelectedProject;
