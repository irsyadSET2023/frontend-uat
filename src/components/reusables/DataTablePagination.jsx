import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
} from "lucide-react";

export const DataTablePagination = ({
  table,
  totalItems = 1,
  pageInfo = {},
  setPageInfo = () => {},
  pageSizeOptions = [],
}) => {
  const handlePageSizeChange = (pageSize) => {
    setPageInfo({ ...pageInfo, pageSize });
  };

  return (
    <div className="flex items-center justify-between px-2 self-stretch">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={String(pageInfo.pageSize)}
          onValueChange={(value) => {
            handlePageSizeChange(value);
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageInfo?.page}{" "}
          {totalItems > 1
            ? `of ${Math.ceil(totalItems / pageInfo.pageSize)}`
            : null}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageInfo({ ...pageInfo, page: 1 })}
            disabled={pageInfo.page === 1 || totalItems === 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPageInfo({ ...pageInfo, page: pageInfo.page - 1 })
            }
            disabled={pageInfo.page === 1 || totalItems === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPageInfo({ ...pageInfo, page: pageInfo.page + 1 })
            }
            disabled={
              pageInfo.page === Math.ceil(totalItems / pageInfo.pageSize) ||
              totalItems === 0
            }
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              setPageInfo({
                ...pageInfo,
                page: Math.ceil(totalItems / pageInfo.pageSize),
              })
            }
            disabled={
              pageInfo.page === Math.ceil(totalItems / pageInfo.pageSize) ||
              totalItems === 0
            }
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
