import React, { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import useCreateChecklistApi from "@/utils/hooks/checklist/useCreateChecklistApi";
import { useProjectContext } from "@/context/ProjectContext";
import useViewChecklistApi from "@/utils/hooks/checklist/useViewChecklistApi";
import useDeleteChecklistApi from "@/utils/hooks/checklist/useDeleteChecklistApi";
import useUpdateChecklistApi from "@/utils/hooks/checklist/useUpdateChecklistApi";
import { useChecklistContext } from "@/context/ChecklistContext";

const ChecklistDrawer = ({ id, setOpen, open, pageInfo, setPageInfo }) => {
  const { projectId } = useProjectContext();
  const { refetch } = useChecklistContext();

  const { data } = useViewChecklistApi({
    checklistId: id,
    projectId,
    enabled: open,
  });

  const checklistSchema = z.object({
    name: z
      .string()
      .min(1, "Checklist name is required.")
      .max(40, "Maximum of 40 characters only."),
    description: z.string().min(1, "Checklist description is required."),
    productLink: z.array(z.string().url("Invalid URL format.")).optional(),
  });
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const checklistForm = useForm({
    resolver: zodResolver(checklistSchema),
    values: {
      name: data?.name || "",
      description: data?.description || "",
      productLink: data?.productLink || [],
    },
  });

  const { loadingState: createLoading, handleCreateChecklist } =
    useCreateChecklistApi({
      form: checklistForm,
      projectId,
      onSuccess: () => {
        checklistForm.reset();
        refetch({ page: pageInfo, pageSize: pageInfo });
        setOpen(false);
      },
    });

  const { handleUpdateChecklist } = useUpdateChecklistApi({
    projectId,
    checklistId: id,
    onSuccess: () => {
      checklistForm.reset();
      refetch();
      setOpen(false);
    },
  });

  const { handleDeleteChecklist } = useDeleteChecklistApi({
    projectId,
    checklistId: id,
    onSuccess: () => {
      checklistForm.reset();
      refetch();
      setOpen(false);
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: checklistForm.control,
    name: "productLink",
  });

  const handleDeleteButton = () => {
    if (isDeleteConfirmed) {
      handleDeleteChecklist();
      setIsDeleteConfirmed(false);
    } else {
      setIsDeleteConfirmed(true);
    }
  };

  const errors = checklistForm.formState.errors;

  return (
    <>
      <SheetContent className="h-full gap-2 flex flex-col">
        <SheetHeader>
          <SheetTitle>
            {id ? "Edit checklist" : "Create new checklist"}
          </SheetTitle>
          <SheetDescription>
            {id
              ? "Edit the details of a checklist"
              : "Fill in the details for a new checklist"}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <Form {...checklistForm}>
          <form
            className="h-full gap-2 flex flex-col"
            onSubmit={checklistForm.handleSubmit(
              id ? handleUpdateChecklist : handleCreateChecklist
            )}
          >
            <FormField
              control={checklistForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={40} />
                  </FormControl>
                  <p className="muted flex justify-end">
                    {field?.value?.length || "0"}/40
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={checklistForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>URL</FormLabel>
              <FormDescription className="text-xs">
                Add specific link(s) for your checklist
              </FormDescription>
              <ul className="space-y-2">
                {fields.map((url, index) => (
                  <FormItem key={index}>
                    <li
                      className="flex flex-row items-center space-x-2"
                      key={url.id}
                    >
                      <Input
                        type="text"
                        id={`url-${index}`}
                        placeholder="https://edu.adnexio.jobs"
                        defaultValue={url.value}
                        {...checklistForm.register(`productLink.${index}`)}
                      />

                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <Trash2 strokeWidth={1.25} type="button" />
                      </Button>
                    </li>
                    {errors.productLink && errors?.productLink[index] && (
                      <FormMessage>
                        {errors?.productLink[index].message}
                      </FormMessage>
                    )}
                  </FormItem>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => append()}
                >
                  Add URL
                </Button>
              </ul>
            </div>
            <SheetFooter className="grow">
              {createLoading === "loading" ? (
                <Button disabled className="w-full mt-auto">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Checklist...
                </Button>
              ) : (
                <Button className="w-full mt-auto">
                  {id ? "Save" : "Create checklist"}
                </Button>
              )}
            </SheetFooter>
            <div className="flex flex-col gap-[8px]">
              {id && (
                <Button
                  className="w-full mt-auto"
                  variant="destructive"
                  onClick={handleDeleteButton}
                  type="button"
                >
                  {isDeleteConfirmed
                    ? "Confirm delete checklist?"
                    : "Delete checklist"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </SheetContent>
    </>
  );
};

export default ChecklistDrawer;
