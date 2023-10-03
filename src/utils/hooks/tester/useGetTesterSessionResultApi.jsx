import { useToast } from "@/components/ui/use-toast";
import { getTesterSessionResult } from "@/utils/api/TesterAPI";
import React, { useEffect, useState } from "react";

const useGetTesterSessionResultApi = ({
  sessionId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleGetTesterSessionResult = async () => {
    try {
      setLoadingState("loading");
      const res = await getTesterSessionResult(sessionId);
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setLoadingState("success");
    } catch (error) {
      setLoadingState("error");
      onError(error);
      if (error.response.status !== 400) {
        toast({
          title: "Error",
          description:
            "Retrieving session result unsuccessful. Please try again.",
          duration: 3000,
          status: "error",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    handleGetTesterSessionResult();
  }, [sessionId]);

  return {
    loadingState,
    data,
    handleGetTesterSessionResult,
  };
};

export default useGetTesterSessionResultApi;
