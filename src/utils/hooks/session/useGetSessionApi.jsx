import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getSession } from "@/utils/api/SessionAPI";

const useGetSessionApi = ({
  projectId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [fetchSessionState, setFetchSessionState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const initialized = useRef(false);

  const handleGetSessions = async () => {
    try {
      if (!projectId) return;
      setData([]);
      setFetchSessionState("loading");
      const res = await getSession(projectId, 1, 10);
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
      handleGetSessions();
    }
  }, []);

  return {
    fetchSessionState,
    data,
    handleGetSessions,
  };
};

export default useGetSessionApi;
