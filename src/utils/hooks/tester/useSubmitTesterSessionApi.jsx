import React, { useState } from "react";
import { submitTesterSession } from "@/utils/api/TesterAPI";
import { useToast } from "@/components/ui/use-toast";

const useSubmitTesterSessionApi = ({
  sessionId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleSubmitTesterSession = async (data) => {
    try {
      setLoadingState("loading");
      const res = await submitTesterSession(sessionId, data);
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setLoadingState("success");
      toast({
        title: "Results submitted",
        description: "You have submitted the results successfully!",
        duration: 3000,
        status: "success",
      });
    } catch (error) {
      setLoadingState("error");
      onError(error);
      if (error?.response?.status !== 400) {
        toast({
          title: "Error",
          description: "Submit session unsuccessful. Please try again.",
          duration: 3000,
          status: "error",
          variant: "destructive",
        });
      }
    }
  };

  return {
    loadingState,
    data,
    handleSubmitTesterSession,
  };
};

export default useSubmitTesterSessionApi;
