import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AccountDrawer from "./AccountDrawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import useAuthApi from "@/utils/hooks/auth/useAuthApi";

const AvatarProfile = () => {
  const { account } = useAuthContext();
  const { handleLogout, handleLogoutTester } = useAuthApi({ null: null });
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="hover:cursor-pointer">
              <AvatarImage src={account?.profilePictureUrl || ""} />
              <AvatarFallback>
                {account?.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="py-4 px-4 -mx-2 -mt-1.5 text-white bg-black">
            <p className="font-bold">
              {account?.organizationName
                ? account?.organizationName
                : "Profile"}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {account?.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {account?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <SheetTrigger asChild>
              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>
            </SheetTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={
              account?.roles === ("owner" || "admin")
                ? handleLogout
                : handleLogoutTester
            }
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SheetContent className="space-y-2">
        <AccountDrawer setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
};

export default AvatarProfile;
