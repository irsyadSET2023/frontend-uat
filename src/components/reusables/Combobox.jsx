import React, { useEffect } from "react";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const Combobox = ({
  data = [],
  field,
  placeholder = "",
  searchPlaceholder = "",
}) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-full justify-between text-muted-foreground")}>
            {`${placeholder}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`${searchPlaceholder}`} />
            <CommandEmpty>Nothing here.</CommandEmpty>
            <CommandGroup>
              {data.map((item, index) => {
                return (
                  <CommandItem
                    key={index}
                    value={item.id}
                    onSelect={() => {
                      handleSelectItem(field, item);
                    }}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        Object.values(field?.value).find(
                          (element) => element.name === item.name
                        )
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {field.value.length > 0 && (
        <div className="pt-5 space-y-6">
          {field.value.map((items, index) => {
            return (
              <div key={index} className="flex justify-between items-center">
                <p className="small">{items.name}</p>
                <div key={items.name} className="flex gap-1">
                  <Select
                    defaultValue={items.permission}
                    onValueChange={(value) => {
                      handleSelectPermission(field, index, value);
                    }}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="canView">Can view</SelectItem>
                        <SelectItem value="canEdit">Can edit</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    className="py-2 px-4"
                    onClick={() => {
                      handleDeletItem(field, items);
                    }}>
                    <Trash2 size={16} strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const handleSelectItem = (field, item) => {
  if (
    Object.values(field?.value).find((element) => element.name === item.name)
  ) {
    const filtered = field.value.filter(
      (element) => element.name !== item.name
    );
    field.onChange(filtered);
  } else {
    field.onChange([
      ...field.value,
      { name: item.name, projectId: item.id, permission: "canView" },
    ]);
  }
};

const handleDeletItem = (field, item) => {
  const filtered = field.value.filter((element) => element.name !== item.name);
  field.onChange(filtered);
};

const handleSelectPermission = (field, index, value) => {
  field.onChange(
    field.value.map((item, i) =>
      i === index ? { ...item, permission: value } : item
    )
  );
};
