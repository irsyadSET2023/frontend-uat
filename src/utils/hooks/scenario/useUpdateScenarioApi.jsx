import { useToast } from "@/components/ui/use-toast";
import { updateScenario } from "@/utils/api/ScenarioAPI";
import { useState } from "react";

const useUpdateScenarioApi = ({
  projectId,
  checklistId,
  scenarioId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();

  const handleUpdateScenario = async (formData) => {
    try {
      setLoadingState("loading");
      await updateScenario(projectId, checklistId, scenarioId, formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Update scenario unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const updateError = error?.response?.data?.errors?.errors || [];
      updateError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
      onError();
    } finally {
      setLoadingState("pending");
    }
  };

  return {
    loadingState,
    handleUpdateScenario,
  };
};

export default useUpdateScenarioApi;
