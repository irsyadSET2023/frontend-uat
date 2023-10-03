import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import useCreateScenarioApi from "@/utils/hooks/scenario/useCreateScenarioApi";
import { useProjectContext } from "@/context/ProjectContext";
import { useChecklistContext } from "@/context/ChecklistContext";
import { useScenarioContext } from "@/context/ScenarioContext";
import useViewScenarioApi from "@/utils/hooks/scenario/useViewScenarioApi";
import useDeleteScenarioApi from "@/utils/hooks/scenario/useDeleteScenarioApi";
import useUpdateScenarioApi from "@/utils/hooks/scenario/useUpdateScenarioApi";
import useProjectPermission from "@/utils/hooks/auth/usePermission";

const ScenarioDrawer = ({ id, setOpen, open }) => {
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const { projectId } = useProjectContext();
  const { checklistId } = useChecklistContext();
  const { refetchScenario } = useScenarioContext();
  const canEdit = useProjectPermission();

  const { data } = useViewScenarioApi({
    projectId,
    checklistId,
    scenarioId: id,
    enabled: open,
  });

  const scenarioSchema = z.object({
    name: z
      .string()
      .min(1, "Checklist name is required.")
      .max(40, "Maximum of 40 characters only."),
  });

  const scenarioForm = useForm({
    resolver: zodResolver(scenarioSchema),
    values: {
      name: data?.name && id ? data?.name : "",
    },
  });

  const { loadingState: createLoading, handleCreateScenario } =
    useCreateScenarioApi({
      form: scenarioForm,
      projectId,
      checklistId,
      onSuccess: () => {
        scenarioForm.reset();
        refetchScenario();
        setOpen(false);
      },
    });

  const { handleUpdateScenario, loadingState: updateLoading } =
    useUpdateScenarioApi({
      projectId,
      checklistId,
      scenarioId: id,
      onSuccess: () => {
        scenarioForm.reset();
        refetchScenario();
        setOpen(false);
      },
    });

  const { handleDeleteScenario, loadingState: deleteLoading } =
    useDeleteScenarioApi({
      projectId,
      checklistId,
      scenarioId: id,
      onSuccess: () => {
        scenarioForm.reset();
        refetchScenario();
        setOpen(false);
      },
    });

  const handleDeleteButton = () => {
    if (isDeleteConfirmed) {
      handleDeleteScenario();
      setIsDeleteConfirmed(false);
    } else {
      setIsDeleteConfirmed(true);
    }
  };

  return (
    <>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>
            {id ? "Edit scenario" : "Create new scenario"}
          </SheetTitle>
          <SheetDescription>
            {id
              ? "Edit the details of a scenario"
              : "Fill in the details for a new scenario"}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <Form {...scenarioForm}>
          <form
            className="flex-grow gap-2 mb-4 flex flex-col"
            onSubmit={scenarioForm.handleSubmit(
              id ? handleUpdateScenario : handleCreateScenario
            )}
          >
            <FormField
              control={scenarioForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!canEdit} maxLength={40} />
                  </FormControl>
                  <p className="muted flex justify-end">
                    {field?.value?.length || "0"}/40
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {canEdit && (
              <SheetFooter className="grow">
                {createLoading === "loading" || updateLoading === "loading" ? (
                  <Button disabled className="w-full mt-auto">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {id ? "Saving..." : "Creating scenario..."}
                  </Button>
                ) : (
                  <Button className="w-full bg-[#18181B] text-[#FAFAFA] mt-auto">
                    {id ? "Save" : "Create scenario"}
                  </Button>
                )}
                {id && (
                  <Button
                    className="w-full "
                    variant="destructive"
                    type="button"
                    onClick={handleDeleteButton}
                    disabled={deleteLoading === "loading"}
                  >
                    {isDeleteConfirmed
                      ? "Confirm delete scenario?"
                      : "Delete scenario"}
                  </Button>
                )}
              </SheetFooter>
            )}
          </form>
        </Form>
      </SheetContent>
    </>
  );
};

export default ScenarioDrawer;
