import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Settings from "./Settings";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetOrganizationMember from "@/utils/hooks/organization/useGetOrganizationMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import useUpdateAdminPermissionsApi from "@/utils/hooks/project/useUpdateAdminPermissionsApi";

const AdminSettings = () => {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { data } = useGetOrganizationMember(
    {
      page: null,
      pageSize: null,
    },
    true
  );

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.username !== user.username));
  };

  const permSchema = z.object({
    permissions: z.string(),
  });

  const permForm = useForm({
    resolver: zodResolver(permSchema),
  });

  // TODO: Add update admin permission
  const { loadingState, updateAdminPermissions } = useUpdateAdminPermissionsApi(
    {
      form: permForm,
    }
  );
  const onSubmit = (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <>
      <Settings title="Admin" subtitle="Admin settings and preferences.">
        <div className="space-y-[24px] max-w-[672px]">
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
                  {data?.data?.map((admin) => (
                    <CommandItem
                      key={admin.id}
                      onSelect={() => {
                        const isSelected = selectedUsers.find(
                          (user) => user.username === admin.username
                        );
                        if (isSelected) {
                          setSelectedUsers(
                            selectedUsers.filter(
                              (user) => user.username !== admin.username
                            )
                          );
                        } else {
                          setSelectedUsers([...selectedUsers, admin]);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUsers.find(
                            (user) => user.username === admin.username
                          )
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {admin.username}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <SelectedItems
            selectedUsers={selectedUsers}
            onRemove={handleRemoveUser}
            permForm={permForm}
          />

          <Button type="submit" className="mt-[32px]">
            Update admin
          </Button>
        </div>
      </Settings>
    </>
  );
};

const SelectedItems = ({ selectedUsers, onRemove, permForm }) => {
  return (
    <>
      {selectedUsers.map((user) => (
        <div
          key={user.username}
          className="flex flex-row items-center justify-between"
        >
          <div className="flex items-center justify-start gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png00" />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="small">{user.username}</p>
              <p className="muted">{user.email}</p>
            </div>
          </div>
          <Form {...permForm}>
            <form onSubmit={() => onSubmit()}>
              <FormField
                control={permForm.control}
                name="permissions"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-[8px]">
                          <Select
                            defaultValue={user.projects[0].permission}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="canView">
                                  Can view
                                </SelectItem>
                                <SelectItem value="canEdit">
                                  Can edit
                                </SelectItem>
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
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
        </div>
      ))}
    </>
  );
};

export default AdminSettings;
