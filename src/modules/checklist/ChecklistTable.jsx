import React, { useEffect, useState } from "react";
import DataTable from "../../components/reusables/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ChecklistDrawer from "./ChecklistDrawer";
import { useChecklistContext } from "@/context/ChecklistContext";
import { Link, useLocation } from "react-router-dom";

const columnHelper = createColumnHelper();

const columnsChecklist = [
  columnHelper.accessor("uniqueId", {
    header: "Id",
    cell: (cell) => {
      const location = useLocation();
      const checklistId = cell?.row?.original?.id;
      const checklistPath = `${location.pathname}/${checklistId}`;

      return (
        <Link to={checklistPath} className="hover:underline">
          <p className="whitespace-nowrap">{cell.getValue()} </p>
        </Link>
      );
    },
    size: 0,
  }),
  columnHelper.accessor("name", {
    header: "Title",
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.accessor("id", {
    header: "",
    cell: (cell) => {
      const checklistId = cell?.row?.original?.id;
      const [open, setOpen] = useState(false);
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="" variant="ghost">
              <MoreHorizontal size={16} strokeWidth={1.5} absoluteStrokeWidth />
            </Button>
          </SheetTrigger>
          <ChecklistDrawer id={checklistId} open={open} setOpen={setOpen} />
        </Sheet>
      );
    },
    size: 0,
  }),
];

const ChecklistTable = () => {
  const { data, pageInfo, setPageInfo, initialized, fetchChecklistState } =
    useChecklistContext();

  useEffect(() => {
    if (initialized.current) setPageInfo({ page: 1, pageSize: 10 });
  }, []);

  return (
    <div className="w-full">
      <DataTable
        columns={columnsChecklist}
        data={data}
        pageInfo={pageInfo}
        setPageInfo={setPageInfo}
        loadingState={fetchChecklistState}
      />
    </div>
  );
};

export default ChecklistTable;
