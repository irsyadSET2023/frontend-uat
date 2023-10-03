import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createCheckList } from "@/utils/api/CheckListAPI";

const DEFAULT_CALLBACKS = {
  onSuccess: (data) => {},
  onError: (data) => {},
};

const useCreateChecklistApi = ({
  form,
  projectId,
  onSuccess,
  onError,
} = DEFAULT_CALLBACKS) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();

  const handleCreateChecklist = async (formData) => {
    try {
      setLoadingState("loading");
      await createCheckList(projectId, formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Create checklist unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const registerError = error?.response?.data?.errors?.errors || [];
      registerError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
    } finally {
      setLoadingState("pending");
    }
  };

  return { loadingState, handleCreateChecklist };
};

export default useCreateChecklistApi;
