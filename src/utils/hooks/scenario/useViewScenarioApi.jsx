import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { viewScenario } from "@/utils/api/ScenarioAPI";

const useViewScenarioApi = ({
  projectId,
  checklistId,
  scenarioId,
  enabled,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleViewScenario = async () => {
    try {
      setData([]);
      setLoadingState("loading");
      const res = await viewScenario(projectId, checklistId, scenarioId);
      setData(res?.data?.data || []);
      setLoadingState("success");
      onSuccess(res?.data?.data);
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Error view scenario",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      onError();
    } finally {
      setLoadingState("pending");
    }
  };

  useEffect(() => {
    if (enabled && scenarioId && projectId && checklistId) {
      handleViewScenario();
    }
  }, [enabled, scenarioId]);

  return { loadingState, data, handleViewScenario };
};

export default useViewScenarioApi;
