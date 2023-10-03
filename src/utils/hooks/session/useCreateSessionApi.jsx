import { useToast } from "@/components/ui/use-toast";
import { createSession } from "@/utils/api/SessionAPI";
import { useState } from "react";

const useCreateSessionApi = ({
  form,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();
  const handleCreateSession = async (formData) => {
    try {
      setLoadingState("loading");
      await createSession(formData);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Create session unsuccessful. Please try again.",
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

  return { loadingState, handleCreateSession };
};

export default useCreateSessionApi;
