import { useToast } from "@/components/ui/use-toast";
import { deleteScenario } from "@/utils/api/ScenarioAPI";
import { useState } from "react";

const useDeleteScenarioApi = ({
  projectId,
  checklistId,
  scenarioId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const { toast } = useToast();

  const handleDeleteScenario = async () => {
    try {
      setLoadingState("loading");
      await deleteScenario(projectId, checklistId, scenarioId);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Delete scenario unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      onError();
    } finally {
      setLoadingState("pending");
    }
  };

  return {
    loadingState,
    handleDeleteScenario,
  };
};

export default useDeleteScenarioApi;
