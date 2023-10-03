import { useToast } from "@/components/ui/use-toast";
import { updateSession } from "@/utils/api/SessionAPI";
import { useState } from "react";

const useUpdateSessionApi = ({
  sessionId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();

  const handleUpdateSession = async (formData) => {
    try {
      setLoadingState("loading");
      await updateSession(sessionId, formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Update session unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const updateError = error?.response?.data?.errors?.errors || [];
      updateError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
      onError();
    } finally {
      setLoadingState("pending");
    }
  };

  return {
    loadingState,
    handleUpdateSession,
  };
};

export default useUpdateSessionApi;
