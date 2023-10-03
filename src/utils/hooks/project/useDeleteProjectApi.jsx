import { useToast } from "@/components/ui/use-toast";
import { deleteProject } from "@/utils/api/ProjAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import useGetProjectApi from "./useGetProjectApi";

const DEFAULT_CALLBACKS = {
  onSuccess: (data) => {},
  onError: (data) => {},
};
const useDeleteProjectApi = ({ onSuccess, onError } = DEFAULT_CALLBACKS) => {
  const [loadingState, setLoadingState] = useState("pending");
  const navigate = useNavigate();

  const { toast } = useToast();
  const { handleGetAllProject } = useGetProjectApi();

  const handleDeleteProject = async (projId) => {
    try {
      setLoadingState("loading");
      await deleteProject(projId);
      await handleGetAllProject();
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Delete Project unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
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
    handleDeleteProject,
  };
};

export default useDeleteProjectApi;
