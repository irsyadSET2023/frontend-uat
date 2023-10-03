import { useToast } from "@/components/ui/use-toast";
import { updateCheckList } from "@/utils/api/CheckListAPI";
import { useState } from "react";

const useUpdateChecklistApi = ({
  projectId,
  checklistId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();

  const handleUpdateChecklist = async (formData) => {
    try {
      setLoadingState("loading");
      await updateCheckList(projectId, checklistId, formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Update checklist unsuccessful. Please try again.",
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
    handleUpdateChecklist,
  };
};

export default useUpdateChecklistApi;
