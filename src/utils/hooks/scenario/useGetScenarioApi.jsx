import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getScenario } from "@/utils/api/ScenarioAPI";

const useGetScenarioApi = ({
  projectId,
  checklistId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const initialized = useRef(false);

  const handleGetScenario = async () => {
    try {
      setData([]);
      setLoadingState("loading");
      if (!(projectId && Number.isInteger(parseInt(checklistId)))) return;
      const res = await getScenario(projectId, checklistId);
      setData(res?.data?.data || []);
      setLoadingState("success");
      onSuccess(res?.data?.data || []);
    } catch (error) {
      setLoadingState("error");
      onError(error);
      toast({
        title: "Error",
        description: "Get scenario unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    handleGetScenario();
  }, [checklistId, projectId]);

  return {
    loadingState,
    data,
    handleGetScenario,
  };
};

export default useGetScenarioApi;
