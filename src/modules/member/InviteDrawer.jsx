import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InviteForm from "./InviteForm";
import { inviteAdmin } from "@/utils/api/AuthAPI";
import { useToast } from "@/components/ui/use-toast";
import { useFieldArray } from "react-hook-form";

const inviteFormSchema = z.object({
  email: z
    .array(z.string().email("This is not a valid email."))
    .refine((value) => value.length > 0),
});

const InviteDrawer = ({ onSuccess = () => {}, onError = () => {} }) => {
  const inviteForm = useForm({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: [],
    },
  });

  const [inviteAdminState, setInviteAdminState] = useState("pending");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleInviteAdmin = async (formData) => {
    const submitData = [];
    console.log(
      formData?.email.map((e, index) => {
        return [...submitData, { email: e }];
      })
    );
    try {
      setInviteAdminState("loading");
      const res = await inviteAdmin(
        formData?.email.map((e, index) => {
          return { email: e };
        })
      );
      toast({
        title: "Admin invited",
        description: `An invitation email has been sent to ${res.data?.data?.user?.email} to join ${res?.data?.data?.org?.name}.`,
        status: "success",
      });
      inviteForm.reset({ email: "" });
      onSuccess();
      setOpen(false);
      setInviteAdminState("success");
      console.log(formData);
    } catch (error) {
      setInviteAdminState("error");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        variant: "destructive",
      });
      inviteForm.setError("email", {
        message:
          error?.response?.data?.error?.errors[0]?.message ||
          "An error occured.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Invite new member</Button>
      </SheetTrigger>
      <SheetContent className=" flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-5 mb-5 border-b border-b-border">
            <SheetTitle>Invite team member</SheetTitle>
            <SheetDescription>
              An email invitation will prompt members to set their username and
              password
            </SheetDescription>
          </SheetHeader>
          <InviteForm form={inviteForm} submitHandler={handleInviteAdmin} />
        </div>
        <SheetFooter>
          <Button
            disabled={inviteAdminState === "loading"}
            onClick={inviteForm.handleSubmit(handleInviteAdmin)}
            type="submit"
            className="w-full"
          >
            {inviteAdminState === "loading" ? "Sending invite..." : "Invite"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default InviteDrawer;
