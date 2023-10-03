import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/reusables/Header";
import DataTable from "../../components/reusables/DataTable";
import InviteDrawer from "./InviteDrawer";
import useGetOrganizationMember from "@/utils/hooks/organization/useGetOrganizationMembers";
import EditMemberDrawer from "./EditMemberDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/reusables/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Members = () => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const {
    data: memberData,
    handleGetOrganizationMember,
    loadingState,
  } = useGetOrganizationMember({
    ...pageInfo,
  });
  const [tabsValue, setTabsValue] = useState("verified");
  const columnHelper = createColumnHelper();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    handleGetOrganizationMember(tabsValue === "verified");
  }, [tabsValue, pageInfo]);

  const columnsPending = [
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: () => {
        return (
          <Button variant="ghost" className="cursor-pointer px-2">
            <MoreHorizontal size={16} />
          </Button>
        );
      },
      size: 0,
    }),
  ];

  const columnsVerified = [
    columnHelper.accessor("username", {
      header: "Member",
      cell: (cell) => <p className="whitespace-nowrap">{cell.getValue()}</p>,
      size: 0,
    }),
    columnHelper.accessor("projects", {
      header: "Projects assigned",
      cell: (cell) => {
        if (!cell.getValue()) {
          return;
        }
        return (
          <div className="flex gap-2">
            {cell.getValue().map((project, index) => (
              <Badge
                key={index}
                className="whitespace-nowrap"
                variant={"outline"}
              >
                {project.name}
              </Badge>
            ))}
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (cell) => {
        const [open, setOpen] = useState(false);
        return (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="" variant="ghost">
                <MoreHorizontal
                  size={16}
                  strokeWidth={1.5}
                  absoluteStrokeWidth
                />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between">
              <EditMemberDrawer
                selectedMember={cell.row.original}
                setOpen={setOpen}
                getOrgMembers={() =>
                  handleGetOrganizationMember(tabsValue === "verified")
                }
              />
            </SheetContent>
          </Sheet>
        );
      },
      size: 0,
    }),
  ];

  return (
    <>
      <Header />
      <div className="min-h-full">
        <div className="p-8 pt-6">
          <div className="flex justify-between mb-4">
            <h2>Organization members</h2>
            <InviteDrawer
              onSuccess={() => {
                setTabsValue("pending");
                handleGetOrganizationMember(false);
              }}
            />
          </div>

          <Tabs value={tabsValue}>
            <TabsList className="mb-4">
              <TabsTrigger
                onClick={() => {
                  setTabsValue("verified");
                  setPageInfo({ ...pageInfo, page: 1 });
                }}
                value="verified"
              >
                Verified
              </TabsTrigger>
              <TabsTrigger
                onClick={() => {
                  setTabsValue("pending");
                  setPageInfo({ ...pageInfo, page: 1 });
                }}
                value="pending"
              >
                Pending
              </TabsTrigger>
            </TabsList>
            <TabsContent value="verified">
              <DataTable
                columns={columnsVerified}
                data={memberData}
                pageInfo={pageInfo}
                setPageInfo={setPageInfo}
                loadingState={loadingState}
              />
            </TabsContent>
            <TabsContent value="pending">
              <DataTable
                columns={columnsPending}
                data={memberData}
                pageInfo={pageInfo}
                setPageInfo={setPageInfo}
                loadingState={loadingState}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Members;
