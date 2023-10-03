import { useToast } from "@/components/ui/use-toast";
import { deleteTesterSession } from "@/utils/api/TesterAPI";
import { useState } from "react";

const useDeleteTesterSessionApi = ({
  sessionId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const { toast } = useToast();

  const handleDeleteTesterSession = async () => {
    try {
      setLoadingState("loading");
      await deleteTesterSession(sessionId);
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
    handleDeleteTesterSession,
  };
};

export default useDeleteTesterSessionApi;
