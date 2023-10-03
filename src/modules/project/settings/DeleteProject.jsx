import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useDeleteProjectApi from "@/utils/hooks/project/useDeleteProjectApi";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "@/context/ProjectContext";

const DeleteProject = ({ projectName, projectId, setOpen }) => {
  const navigate = useNavigate();
  const { refetchProjects } = useProjectContext();
  const { handleDeleteProject, loadingState } = useDeleteProjectApi({
    onSuccess: async () => {
      await refetchProjects();
      navigate("/app");
      setOpen(false);
    },
  });
  const lowercaseProjectName = projectName.toLowerCase();
  const dashedProjectName = lowercaseProjectName.split(" ").join("-");
  const deleteSchema = z.object({
    confirmDeleteInput: z
      .string()
      .refine((value) => value === "sudo delete " + dashedProjectName),
  });
  const deleteForm = useForm({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmDeleteInput: "",
    },
  });

  return (
    <div className="flex flex-col h-full gap-6">
      <SheetHeader>
        <SheetTitle>Delete {projectName}</SheetTitle>
        <SheetDescription>
          This action will permanently remove all associated data, files, and
          history related to this project.
        </SheetDescription>
      </SheetHeader>
      <Form {...deleteForm}>
        <form
          className="flex-grow gap-4 flex flex-col"
          onSubmit={deleteForm.handleSubmit(() =>
            handleDeleteProject(projectId)
          )}
        >
          <FormField
            control={deleteForm.control}
            name="confirmDeleteInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Type 'sudo delete ${dashedProjectName}'`}</FormLabel>
                <FormControl>
                  <Input type="confirmDeleteInput" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter className="grow">
            <Button
              disabled={
                !deleteForm.formState.isValid || loadingState === "loading"
              }
              variant="destructive"
              className="w-full mt-auto"
            >
              {loadingState === "loading" ? "Deleting..." : "Delete project"}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </div>
  );
};

export default DeleteProject;
