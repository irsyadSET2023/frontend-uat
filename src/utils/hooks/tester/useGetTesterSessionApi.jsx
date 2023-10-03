import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getTesterSession } from "@/utils/api/TesterAPI";

const useGetTesterSessionApi = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [fetchSessionState, setFetchSessionState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const initialized = useRef(false);

  const handleGetTesterSession = async () => {
    try {
      setData([]);
      setFetchSessionState("loading");
      const res = await getTesterSession();
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setFetchSessionState("success");
    } catch (error) {
      setFetchSessionState("error");
      onError(error);
      if (error?.response?.status !== 400) {
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
      handleGetTesterSession();
    }
  }, []);

  return {
    fetchSessionState,
    data,
    handleGetTesterSession,
  };
};

export default useGetTesterSessionApi;
