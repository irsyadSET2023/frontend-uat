import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getTestcases } from "@/utils/api/TestcaseAPI";

const useGetTestcaseApi = ({
  projectId,
  scenarioId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const initialized = useRef(false);

  const handleGetTestCase = async () => {
    try {
      setData([]);
      setLoadingState("loading");
      if (!(projectId && scenarioId)) return;

      const res = await getTestcases(projectId, scenarioId);
      setData(res?.data?.data?.rows || []);
      setLoadingState("success");
      onSuccess(res?.data?.data?.rows || []);
    } catch (error) {
      setLoadingState("error");
      onError(error);
      toast({
        title: "Error",
        description: "Get test case unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      handleGetTestCase();
    }
  }, [projectId, scenarioId]);

  return {
    loadingState,
    data,
    handleGetTestCase,
  };
};

export default useGetTestcaseApi;
