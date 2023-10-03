import React, { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useJoinTesterSessionApi from "@/utils/hooks/tester/useJoinTesterSessionApi";
import useDeleteTesterSessionApi from "@/utils/hooks/tester/useDeleteTesterSessionApi";

const TesterDrawer = ({ refetch, id, checklistName, uniqueId, setOpen }) => {
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const testerSchema = z.object({
    sessionId: z
      .string()
      .min(1, "Unique id is required.")
      .max(40, "Maximum of 40 characters only."),
  });
  const testerForm = useForm({
    resolver: zodResolver(testerSchema),
    defaultValues: {
      sessionId: "",
    },
  });

  const { loadingState, handleJoinTesterSession } = useJoinTesterSessionApi({
    form: testerForm,
    onSuccess: () => {
      setOpen(false);
      testerForm.reset();
      refetch();
    },
  });

  const { loadingState: deleteLoadingState, handleDeleteTesterSession } =
    useDeleteTesterSessionApi({
      sessionId: id,
      onSuccess: () => {
        setOpen(false);
        testerForm.reset();
        refetch();
      },
    });

  const handleDeleteButton = () => {
    if (isDeleteConfirmed) {
      handleDeleteTesterSession();
      setIsDeleteConfirmed(false);
    } else {
      setIsDeleteConfirmed(true);
    }
  };

  return (
    <>
      <SheetContent className="h-full gap-[8px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{id ? "Edit session" : "Join session"}</SheetTitle>
          <SheetDescription>{id ? checklistName : null}</SheetDescription>
        </SheetHeader>
        <Separator />
        <Form {...testerForm}>
          <form
            className="h-full gap-[8px] flex flex-col"
            onSubmit={testerForm.handleSubmit((formData) =>
              handleJoinTesterSession(formData)
            )}
          >
            <FormField
              control={testerForm.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Id</FormLabel>
                  <FormControl>
                    {id ? (
                      <Input
                        {...field}
                        maxLength={40}
                        placeholder={uniqueId}
                        disabled
                      ></Input>
                    ) : (
                      <Input {...field} maxLength={40} />
                    )}
                  </FormControl>
                  {id ? null : (
                    <p className="muted flex justify-end">
                      {field.value.length}/40
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="grow">
              {id ? (
                <Button
                  className="w-full mt-auto"
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteButton}
                  disabled={
                    deleteLoadingState === "loading" ||
                    deleteLoadingState === "success"
                  }
                >
                  {isDeleteConfirmed
                    ? "Confirm delete session?"
                    : deleteLoadingState === "loading"
                    ? "Deleting session..."
                    : deleteLoadingState === "success"
                    ? "Deleted successfully!"
                    : "Delete session"}
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#18181B] text-[#FAFAFA] mt-auto"
                  disabled={
                    loadingState === "loading" || loadingState === "success"
                  }
                >
                  {loadingState === "loading"
                    ? "Joining session..."
                    : loadingState === "success"
                    ? "Joined successfully!"
                    : "Join session"}
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </>
  );
};

export default TesterDrawer;
