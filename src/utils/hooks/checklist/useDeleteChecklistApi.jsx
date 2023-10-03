import { useToast } from "@/components/ui/use-toast";
import { deleteCheckList } from "@/utils/api/CheckListAPI";
import { useState } from "react";

const useDeleteChecklistApi = ({
  projectId,
  checklistId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const { toast } = useToast();

  const handleDeleteChecklist = async () => {
    try {
      setLoadingState("loading");
      await deleteCheckList(projectId, checklistId);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Delete Checklist unsuccessful. Please try again.",
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
    handleDeleteChecklist,
  };
};

export default useDeleteChecklistApi;
