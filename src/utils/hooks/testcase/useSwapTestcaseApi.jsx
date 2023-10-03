import React, { useState } from "react";
import { swapTestcase } from "@/utils/api/TestcaseAPI";

const useSwapTestcaseApi = ({
  projectId,
  scenarioId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const handleSwapTestcase = async (data) => {
    if (!data) return;
    try {
      setLoadingState("loading");
      const res = await swapTestcase(projectId, scenarioId, {
        testCaseIdArray: data,
      });
      setLoadingState("success");
      onSuccess(res.data.data);
    } catch (error) {
      setLoadingState("error");
      onError(error);
    }
  };

  return { loadingState, handleSwapTestcase };
};

export default useSwapTestcaseApi;
