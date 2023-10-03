import { updateAdminProjects } from "@/utils/api/ProjAPI";
import { useState } from "react";

const useUpdateAdminProjectsApi = ({
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const handleUpdateAdminProjects = async (formData, selectedUserId) => {
    try {
      setLoadingState("loading");
      const res = await updateAdminProjects(selectedUserId, formData);
      setLoadingState("success");
      onSuccess(res);
    } catch (error) {
      setLoadingState("error");
      onError(error);
    }
  };

  return {
    loadingState,
    handleUpdateAdminProjects,
  };
};

export default useUpdateAdminProjectsApi;
