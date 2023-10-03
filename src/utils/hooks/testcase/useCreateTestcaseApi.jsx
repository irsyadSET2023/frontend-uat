import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createTestcase } from "@/utils/api/TestcaseAPI";

const useCreateTestcaseApi = ({
  form,
  projectId,
  scenarioId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();

  const handleCreateTestcase = async (formData) => {
    try {
      setLoadingState("loading");
      toast({
        title: "Creating test case...",
      });
      const res = await createTestcase(projectId, scenarioId, formData);
      toast({
        title: "Test case created.",
        duration: 3000,
      });
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      onError(error);
      toast({
        title: "Create test case unsuccessful",
        description: error?.response?.data?.message || "",
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

  return { loadingState, handleCreateTestcase };
};

export default useCreateTestcaseApi;
