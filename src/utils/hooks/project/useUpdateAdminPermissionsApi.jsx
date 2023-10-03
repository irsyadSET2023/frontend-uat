import { updateAdminPermissions } from "@/utils/api/ProjAPI";
import React, { useState } from "react";

const useUpdateAdminPermissionsApi = () => {
  const [loadingState, setLoadingState] = useState("pending");

  const handleUpateAdminPermissions = async (formData, selectedProjectId) => {
    try {
      setLoadingState("loading");
      const res = await updateAdminPermissions(selectedProjectId, formData);
      setLoadingState("success");
      // onSuccess(res);
    } catch (error) {
      setLoadingState("error");
      // onError(error);
    }
  };
  return {
    loadingState,
    handleUpateAdminPermissions,
  };
};
export default useUpdateAdminPermissionsApi;
