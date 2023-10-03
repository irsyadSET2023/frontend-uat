import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCheckList } from "@/utils/api/CheckListAPI";

const useGetChecklistApi = ({
  projectId,
  page,
  pageSize,
  initialized,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [fetchChecklistState, setFetchChecklistState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();

  const handleGetChecklists = async () => {
    try {
      if (!projectId) return;
      setData([]);
      setFetchChecklistState("loading");
      const res = await getCheckList({
        projId: projectId,
        page,
        perPage: pageSize,
      });
      setData(res?.data?.data || []);
      onSuccess(res?.data?.data);
      setFetchChecklistState("success");
    } catch (error) {
      setFetchChecklistState("error");
      onError(error);
      if (error.response.status !== 400) {
        toast({
          title: "Error",
          description: "Get checklist unsuccessful. Please try again.",
          duration: 3000,
          status: "error",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      handleGetChecklists();
      return;
    }
    handleGetChecklists();
  }, [page, projectId]);

  return {
    fetchChecklistState,
    data,
    handleGetChecklists,
  };
};

export default useGetChecklistApi;
