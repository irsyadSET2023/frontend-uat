import { useToast } from "@/components/ui/use-toast";
import { updateTestcase } from "@/utils/api/TestcaseAPI";
import { useState } from "react";

const useUpdateTestcaseApi = ({
  projectId,
  scenarioId,
  testcaseId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();

  const handleUpdateTestcase = async (formData) => {
    try {
      setLoadingState("loading");
      await updateTestcase(projectId, scenarioId, testcaseId, formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Update testcase unsuccessful. Please try again.",
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
    handleUpdateTestcase,
  };
};

export default useUpdateTestcaseApi;
