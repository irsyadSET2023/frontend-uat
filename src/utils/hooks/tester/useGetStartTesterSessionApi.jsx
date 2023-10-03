import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getStartTesterSession } from "@/utils/api/TesterAPI";

const useGetStartTesterSessionApi = ({
  sessionId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [fetchSessionState, setFetchSessionState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleGetStartTesterSession = async () => {
    if (!sessionId) return;
    try {
      setData([]);
      setFetchSessionState("loading");
      const res = await getStartTesterSession(sessionId);
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setFetchSessionState("success");
    } catch (error) {
      setFetchSessionState("error");
      onError(error);
      if (error.response.status !== 400) {
        toast({
          title: "Error",
          description: "Start session unsuccessful. Please try again.",
          duration: 3000,
          status: "error",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    handleGetStartTesterSession();
  }, [sessionId]);

  return {
    fetchSessionState,
    data,
    handleGetStartTesterSession,
  };
};

export default useGetStartTesterSessionApi;
