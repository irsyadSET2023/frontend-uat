import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { viewSession } from "@/utils/api/SessionAPI";

const useViewSessionApi = ({
  sessionId,
  enabled,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState(null);
  const { toast } = useToast();

  const handleViewSession = async () => {
    try {
      if (!sessionId) return;
      setData(null);
      setLoadingState("loading");
      const res = await viewSession(sessionId);
      setData(res?.data?.data || null);
      setLoadingState("success");
      onSuccess(res?.data?.data);
    } catch (error) {
      setLoadingState("error");

      toast({
        title: "Error",
        description: error.response.data.message || "Error view session",
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
      handleViewSession();
    }
  }, [enabled, sessionId]);

  return { loadingState, data, handleViewSession };
};

export default useViewSessionApi;
