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

export const AdminCombobox = ({
  data = [],
  field,
  placeholder = "",
  searchPlaceholder = "",
}) => {
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {"Select admin..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search organization member..." />
            <CommandEmpty>No admin found.</CommandEmpty>
            <CommandGroup>
              {data.map((item, index) => {
                return (
                  <CommandItem
                    key={index}
                    value={item.id}
                    onSelect={() => {
                      const isSelected = selectedUsers.find(
                        (user) => user.username === item.username
                      );
                      if (isSelected) {
                        setSelectedUsers(
                          selectedUsers.filter(
                            (user) => user.username !== item.username
                          )
                        );
                      } else {
                        setSelectedUsers([...selectedUsers, item]);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUsers.find(
                          (user) => user.username === item.username
                        )
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.username}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="pt-5 space-y-6">
        {field.value.map((items, index) => {
          console.log(field);
          return (
            <div
              key={items.username}
              className="flex flex-row items-center justify-between"
            >
              <div className="flex items-center justify-start gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png00" />
                  <AvatarFallback>
                    {items.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="small">{items.username}</p>
                  <p className="muted">{items.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <Select
                  defaultValue={user.projects[0].permission}
                  onValueChange={handleSelectPermission(field, index, value)}
                >
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
                  onClick={() => onRemove(user)}
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const handleDeleteItem = (field, item) => {
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
