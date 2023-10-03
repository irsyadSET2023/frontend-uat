import { useToast } from "@/components/ui/use-toast";
import { updateProject } from "@/utils/api/ProjAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom/dist";

const useUpdateProjectApi = ({
  form,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleUpdateProject = async (projId, formData) => {
    try {
      setLoadingState("loading");
      await updateProject(projId, formData);
      toast({
        title: "Updated project!",
        description: "Project successfully updated.",
        duration: 3000,
        status: "success",
      });
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Update unsuccessful. Please try again.",
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

  useEffect(() => {
    if (loadingState === "success") {
      navigate("/app");
    }
  }, [loadingState]);

  return {
    loadingState,
    handleUpdateProject,
  };
};

export default useUpdateProjectApi;
