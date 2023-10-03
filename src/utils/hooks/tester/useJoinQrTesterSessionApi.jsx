import { useEffect, useState } from "react";
import { joinQrTesterSession } from "@/utils/api/TesterAPI";
import { useToast } from "@/components/ui/use-toast";

const useJoinQrTesterSessionApi = ({
  sessionUniqueId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleJoinQrTesterSession = async () => {
    try {
      setLoadingState("loading");
      const res = await joinQrTesterSession(sessionUniqueId);
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setLoadingState("success");
    } catch (error) {
      setLoadingState("error");
      onError(error);
      if (error?.response?.status !== 401) {
        toast({
          title: "Error",
          description: "Join session unsuccessful. Please try again.",
          duration: 3000,
          status: "error",
          variant: "destructive",
        });
      }
    }
  };
  useEffect(() => {
    handleJoinQrTesterSession();
  }, [sessionUniqueId]);

  return {
    loadingState,
    data,
    handleJoinQrTesterSession,
  };
};

export default useJoinQrTesterSessionApi;
