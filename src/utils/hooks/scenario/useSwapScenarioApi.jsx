import React, { useState } from "react";
import { swapScenario } from "@/utils/api/ScenarioAPI";

const useSwapScenarioApi = ({
  projectId,
  checklistId,
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const [loadingState, setLoadingState] = useState("pending");

  const handleSwapScenario = async (data) => {
    if (!data) return;
    try {
      setLoadingState("loading");
      const res = await swapScenario(projectId, checklistId, {
        scenarioIdArray: data,
      });
      setLoadingState("success");
      onSuccess(res.data.data);
    } catch (error) {
      setLoadingState("error");
      onError(error);
    }
  };

  return { loadingState, handleSwapScenario };
};

export default useSwapScenarioApi;
