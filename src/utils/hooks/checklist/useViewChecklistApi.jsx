import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { viewCheckList } from "@/utils/api/CheckListAPI";

const useViewChecklistApi = ({
  projectId,
  checklistId,
  enabled,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleViewChecklist = async () => {
    try {
      setLoadingState("loading");
      const res = await viewCheckList(projectId, checklistId);
      setData(res?.data?.data);
      setLoadingState("success");
      onSuccess(res?.data?.data);
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Error view checklist",
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
    if (enabled) {
      handleViewChecklist();
    }
  }, [enabled, checklistId]);

  return { loadingState, data, handleViewChecklist };
};

export default useViewChecklistApi;
