import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { viewProject } from "@/utils/api/ProjAPI";

const useViewProjectApi = ({
  projectId,
  enabled,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState(null);
  const { toast } = useToast();
  const initialized = useRef(false);

  const handleViewProject = async () => {
    if (!enabled) return;
    try {
      setData(null);
      setLoadingState("loading");
      const res = await viewProject(projectId);
      setData(res?.data?.data || null);
      setLoadingState("success");
      onSuccess(res?.data?.data);
    } catch (error) {
      setLoadingState("error");

      toast({
        title: "Error",
        description: error.response.data.message || "Error view project",
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
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    handleViewProject();
  }, [projectId]);

  return { loadingState, data, handleViewProject };
};

export default useViewProjectApi;
