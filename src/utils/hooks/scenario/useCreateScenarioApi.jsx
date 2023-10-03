import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createScenario } from "@/utils/api/ScenarioAPI";

const useCreateScenarioApi = ({
  form,
  projectId,
  checklistId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();

  const handleCreateScenario = async (formData) => {
    try {
      setLoadingState("loading");
      await createScenario(projectId, checklistId, formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      onError(error);
      toast({
        title: "Error",
        description: "Create scenario unsuccessful. Please try again.",
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

  return { loadingState, handleCreateScenario };
};

export default useCreateScenarioApi;
