import { useToast } from "@/components/ui/use-toast";
import { deleteTestcase } from "@/utils/api/TestcaseAPI";
import { useState } from "react";

const useDeleteTestcaseApi = ({
  projectId,
  scenarioId,
  testcaseId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const { toast } = useToast();

  const handleDeleteTestcase = async () => {
    try {
      setLoadingState("loading");
      await deleteTestcase(projectId, scenarioId, testcaseId);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Delete testcase unsuccessful. Please try again.",
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
    handleDeleteTestcase,
  };
};

export default useDeleteTestcaseApi;
