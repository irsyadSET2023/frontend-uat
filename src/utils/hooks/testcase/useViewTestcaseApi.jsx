import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { viewTestcase } from "@/utils/api/TestcaseAPI";

const useViewTestcaseApi = ({
  projectId,
  testcaseId,
  scenarioId,
  enabled,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleViewTestcase = async () => {
    try {
      setData([]);
      setLoadingState("loading");
      const res = await viewTestcase(projectId, scenarioId, testcaseId);
      setData(res?.data?.data || []);
      setLoadingState("success");
      onSuccess(res?.data?.data);
    } catch (error) {
      console.log(error);
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
    if (enabled && scenarioId && projectId && testcaseId) {
      handleViewTestcase();
    }
  }, [enabled, testcaseId]);

  return { loadingState, data, handleViewTestcase };
};

export default useViewTestcaseApi;
