import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { startSession } from "@/utils/api/SessionAPI";

const useStartSessionApi = ({
  sessionId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [fetchSessionState, setFetchSessionState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const initialized = useRef(false);

  const handleStartSession = async () => {
    try {
      if (!sessionId) return;
      setData([]);
      setFetchSessionState("loading");
      const res = await startSession(sessionId);
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setFetchSessionState("success");
    } catch (error) {
      setFetchSessionState("error");
      onError(error);
      if (error.response.status !== 400) {
        toast({
          title: "Error",
          description: "Get session unsuccessful. Please try again.",
          duration: 3000,
          status: "error",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      handleStartSession();
    }
  }, []);

  return {
    fetchSessionState,
    data,
    handleStartSession,
  };
};

export default useStartSessionApi;
