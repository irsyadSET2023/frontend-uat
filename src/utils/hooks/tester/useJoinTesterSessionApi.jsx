import { useToast } from "@/components/ui/use-toast";
import { joinTesterSession } from "@/utils/api/TesterAPI";
import { useState } from "react";

const useJoinTesterSessionApi = ({
  form,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();
  const handleJoinTesterSession = async (formData) => {
    try {
      setLoadingState("loading");
      await joinTesterSession(formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Join session unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const registerError = error?.response?.data?.errors?.errors || [];
      registerError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
      onError();
    } finally {
      setLoadingState("pending");
    }
  };

  return { loadingState, handleJoinTesterSession };
};

export default useJoinTesterSessionApi;
