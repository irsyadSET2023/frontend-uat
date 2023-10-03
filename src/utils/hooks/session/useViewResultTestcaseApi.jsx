import { viewSessionTestcaseResult } from "@/utils/api/SessionAPI";
import React, { useRef, useState } from "react";

const useViewResultTestcaseApi = ({
  sessionId,
  testcaseId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [data, setData] = useState([]);
  const [loadingState, setLoadingState] = useState("pending");
  const initialized = useRef(false);

  const handleViewResultTestcase = async () => {
    if (!testcaseId) return;
    try {
      setLoadingState("loading");
      const res = await viewSessionTestcaseResult(sessionId, testcaseId);
      setData(res?.data?.data);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      onError();
    }
  };

  return { data, loadingState, handleViewResultTestcase };
};

export default useViewResultTestcaseApi;
