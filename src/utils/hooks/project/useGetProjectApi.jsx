import { useToast } from "@/components/ui/use-toast";
import { getProject } from "@/utils/api/ProjAPI";
import { useEffect, useRef, useState } from "react";

const DEFAULT_CALLBACKS = {
  onSuccess: (data) => {},
  onError: (data) => {},
};

const useGetProjectApi = ({ onSuccess, onError } = DEFAULT_CALLBACKS) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const initialized = useRef(false);

  const handleGetAllProject = async () => {
    try {
      setData([]);
      setLoadingState("loading");
      const res = await getProject();
      setLoadingState("success");
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "View project unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      onError(error);
    } finally {
      setLoadingState("pending");
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      handleGetAllProject();
    }
  }, []);

  return {
    loadingState,
    data,
    handleGetAllProject,
  };
};

export default useGetProjectApi;
