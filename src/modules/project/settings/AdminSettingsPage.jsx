import React, { useEffect } from "react";
import useGetProjectApi from "@/utils/hooks/project/useGetProjectApi";
import useUpdateAdminProjectsApi from "@/utils/hooks/project/useUpdateAdminProjectsApi";
import EditAdminSettingsForm from "./editAdminSettingsForm";

const AdminSettingsPage = ({ setOpen, getOrgMembers }) => {
  const { data: projectData, loadingState: getProjectState } =
    useGetProjectApi();

  const { loadingState: updateAdminProjectsState, handleUpdateAdminProjects } =
    useUpdateAdminProjectsApi({
      editPermsForm,
      onSuccess: () => {
        setOpen(false);
        getOrgMembers();
      },
    });

  useEffect(() => {
    if (getProjectState === "success")
      editPermsForm.resetField("projectsAssigned");
  }, [getProjectState]);

  return (
    <>
      <div>
        <EditAdminSettingsForm projectData={projectData} form={editPermsForm} />
      </div>
    </>
  );
};

export default AdminSettingsPage;
