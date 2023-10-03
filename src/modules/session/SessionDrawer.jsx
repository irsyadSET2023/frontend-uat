import React, { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe2, Loader2, Lock, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import useCreateSessionApi from "@/utils/hooks/session/useCreateSessionApi";
import { useProjectContext } from "@/context/ProjectContext";
import useViewSessionApi from "@/utils/hooks/session/useViewSessionApi";
import useUpdateSessionApi from "@/utils/hooks/session/useUpdateSessionApi";
import useDeleteSessionApi from "@/utils/hooks/session/useDeleteSessionApi";
import { useChecklistContext } from "@/context/ChecklistContext";

const sessionSchema = z.object({
  checklistId: z.number().int(),
  status: z.string(),
  emailDomain: z.array(
    z.string().refine(
      (value) => {
        const domainRegex = /^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return domainRegex.test(value);
      },
      {
        message: "Invalid email domain",
      }
    )
  ),
});
const SessionDrawer = ({ refetch, id, checklistName, open, setOpen }) => {
  const { projects: projectData, projectId } = useProjectContext();
  const { data } = useChecklistContext({ projectId });
  const { data: sessionData } = useViewSessionApi({
    sessionId: id,
    enabled: open,
  });

  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const sessionForm = useForm({
    resolver: zodResolver(sessionSchema),
    values: {
      checklistId: sessionData
        ? sessionData.checklistId
        : "Select one checklist",
      status: sessionData ? sessionData?.status : "locked",
      emailDomain: sessionData ? sessionData?.emailDomain : [],
    },
  });

  const buttonStyle1 =
    "flex p-4 flex-col items-center gap-[12px] flex-1 border-[2px] border-[#F4F4F5] h-[80px] w-full";

  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({
      control: sessionForm.control,
      name: "emailDomain",
    });

  const { loadingState, handleCreateSession } = useCreateSessionApi({
    form: sessionForm,
    onSuccess: () => {
      setOpen(false);
      sessionForm.reset();
      refetch();
    },
  });

  const { handleDeleteSession } = useDeleteSessionApi({
    sessionId: id,
    onSuccess: () => {
      setOpen(false);
      sessionForm.reset();
      refetch();
    },
  });

  const { handleUpdateSession } = useUpdateSessionApi({
    form: sessionForm,
    sessionId: id,
    onSuccess: () => {
      setOpen(false);
      sessionForm.reset();
      refetch();
    },
  });

  const handleDeleteButton = () => {
    if (isDeleteConfirmed) {
      handleDeleteSession();
      setIsDeleteConfirmed(false);
    } else {
      setIsDeleteConfirmed(true);
    }
  };

  const errors = sessionForm.formState.errors;

  return (
    <>
      <SheetContent className="flex flex-col h-full gap-6">
        <SheetHeader>
          <SheetTitle>{id ? "Edit session" : "Create new session"}</SheetTitle>
          <SheetDescription>
            {!id &&
              "Fill in the details for a new user acceptance testing session."}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <Form {...sessionForm}>
          <form
            className="flex-grow justify-between gap-4 flex flex-col"
            onSubmit={sessionForm.handleSubmit((formData) => {
              return id
                ? handleUpdateSession(formData)
                : handleCreateSession(formData);
            })}
          >
            <div className="space-y-4">
              <FormField
                control={sessionForm.control}
                name="checklistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Checklist</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(e) => field.onChange(parseInt(e))}
                      >
                        <SelectTrigger
                          // disabled={!id ? true : false}
                          className="w-full"
                        >
                          <SelectValue
                            placeholder={
                              id ? checklistName : "Select one checklist"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.data?.map((item, index) => (
                            <SelectItem key={index} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sessionForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public status</FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center gap-[16px] self-stretch">
                        <Button
                          type="button"
                          variant="outline"
                          className={
                            sessionForm.watch().status === "locked"
                              ? `${buttonStyle1} border-[#18181B]`
                              : buttonStyle1
                          }
                          onClick={() => field.onChange("locked")}
                        >
                          <Lock strokeWidth={1.5} width={16} height={16} />
                          <p className="small font-[400] text-[12px]">Locked</p>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className={
                            sessionForm.watch().status === "public"
                              ? `${buttonStyle1} border-[#18181B]`
                              : buttonStyle1
                          }
                          onClick={() => field.onChange("public")}
                        >
                          <Globe2 strokeWidth={1.5} width={16} height={16} />
                          <p className="small font-[400] text-[12px]">Public</p>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Allowed email domain</FormLabel>
                <FormDescription className="text-xs">
                  Please specify the allowed email domains for testers to join
                  the session and submit their checklist responses. Leave this
                  field blank to accept all domains.
                </FormDescription>
                <ul className="space-y-2">
                  {fields.map((email, index) => (
                    <FormItem key={index}>
                      <li
                        className="flex flex-row items-center space-x-2"
                        key={email.id}
                      >
                        <Input
                          type="text"
                          id={`email-${index}`}
                          placeholder="@invokeisdata.com"
                          defaultValue={email.value}
                          {...sessionForm.register(`emailDomain.${index}`)}
                        />
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash2 strokeWidth={1.25} type="button" />
                        </Button>
                      </li>
                      {errors.emailDomain && errors?.emailDomain[index] && (
                        <FormMessage>
                          {errors?.emailDomain[index].message}
                        </FormMessage>
                      )}
                    </FormItem>
                  ))}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => append()}
                  >
                    Add domain
                  </Button>
                </ul>
              </div>
            </div>
            <SheetFooter>
              <div className="w-full space-y-[8px]">
                {loadingState === "loading" ? (
                  <Button disabled className="w-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating session...
                  </Button>
                ) : (
                  <Button className="w-full bg-[#18181B] text-[#FAFAFA] mt-auto">
                    {id ? "Save" : "Create session"}
                  </Button>
                )}
                {id && (
                  <Button
                    className="w-full"
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteButton}
                  >
                    {isDeleteConfirmed
                      ? "Confirm delete session?"
                      : "Delete session"}
                  </Button>
                )}
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </>
  );
};

export default SessionDrawer;
