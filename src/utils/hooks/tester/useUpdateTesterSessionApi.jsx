import React, { useState } from "react";
import { updateTesterSession } from "@/utils/api/TesterAPI";
import { useToast } from "@/components/ui/use-toast";

const useUpdateTesterSessionApi = ({
  sessionId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleUpdateTesterSession = async (data) => {
    try {
      setLoadingState("loading");
      const res = await updateTesterSession(sessionId, data);
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setLoadingState("success");
      toast({
        title: "Results updated",
        description: "You have updated the results successfully!",
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
    handleUpdateTesterSession,
  };
};

export default useUpdateTesterSessionApi;
