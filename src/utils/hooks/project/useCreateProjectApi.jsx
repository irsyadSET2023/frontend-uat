import { useToast } from "@/components/ui/use-toast";
import { createProject } from "@/utils/api/ProjAPI";
import { useState } from "react";

const useCreateProjectApi = ({
  form,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { toast } = useToast();
  const handleCreateProject = async (formData) => {
    try {
      setLoadingState("loading");
      await createProject(formData);
      setLoadingState("success");
      form.reset();
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Create Project unsuccessful. Please try again.",
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

  return { loadingState, handleCreateProject };
};

export default useCreateProjectApi;
