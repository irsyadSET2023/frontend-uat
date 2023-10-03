import React, { useEffect } from "react";
import useGetProjectApi from "@/utils/hooks/project/useGetProjectApi";
import * as z from "zod";
import EditMemberForm from "./EditMemberForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useUpdateAdminProjectsApi from "@/utils/hooks/project/useUpdateAdminProjectsApi";

const EditMemberDrawer = ({ setOpen, selectedMember, getOrgMembers }) => {
  const { data: projectData, loadingState: getProjectState } =
    useGetProjectApi();

  const editMemberSchema = z.object({
    username: z.string().optional(),
    email: z.string().optional(),
    projectsAssigned: z.array(),
  });

  editMemberSchema.shape.projectsAssigned = z.array(
    z.object({
      name: z.string(),
      projectId: z.number().refine(async (value) => {
        if (value === undefined) return false;
        if (projectData.filter((project) => project.id === value).length > 0)
          return true;
        return false;
      }),
      permission: z.string(),
    })
  );

  const editMemberForm = useForm({
    resolver: zodResolver(editMemberSchema),
    values: {
      username: selectedMember.username,
      email: selectedMember.email,
      projectsAssigned: selectedMember.projects.map((p) => {
        return {
          name: p.name,
          projectId: projectData.filter((project) => p.name === project.name)[0]
            ?.id,
          permission: p.permission,
        };
      }),
    },
  });
  const { loadingState: updateAdminProjectsState, handleUpdateAdminProjects } =
    useUpdateAdminProjectsApi({
      editMemberForm,
      onSuccess: () => {
        setOpen(false);
        getOrgMembers();
      },
    });

  useEffect(() => {
    if (getProjectState === "success")
      editMemberForm.resetField("projectsAssigned");
  }, [getProjectState]);

  return (
    <>
      <div>
        <SheetHeader className="border-b pb-6 mb-6">
          <SheetTitle>Edit {`${selectedMember.username}`}</SheetTitle>
          <SheetDescription>
            Make changes to your organisation member. Click save when you're
            done.
          </SheetDescription>
        </SheetHeader>
        <EditMemberForm projectData={projectData} form={editMemberForm} />
      </div>

      <SheetFooter>
        <Button
          disabled={updateAdminProjectsState === "loading"}
          onClick={editMemberForm.handleSubmit((formData) =>
            handleUpdateAdminProjects(
              formData.projectsAssigned,
              selectedMember.id
            )
          )}>
          {updateAdminProjectsState === "loading" ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            console.log("remove member");
          }}>
          Remove from organization
        </Button>
      </SheetFooter>
    </>
  );
};

export default EditMemberDrawer;
