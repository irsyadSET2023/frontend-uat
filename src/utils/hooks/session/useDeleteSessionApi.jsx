import { useToast } from "@/components/ui/use-toast";
import { deleteSession } from "@/utils/api/SessionAPI";
import { useState } from "react";

const useDeleteSessionApi = ({
  sessionId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const { toast } = useToast();

  const handleDeleteSession = async () => {
    try {
      setLoadingState("loading");
      await deleteSession(sessionId);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      console.log(error);
      toast({
        title: "Error",
        description: "Delete session unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      onError();
    } finally {
      setLoadingState("pending");
    }
  };

  return {
    loadingState,
    handleDeleteSession,
  };
};

export default useDeleteSessionApi;
