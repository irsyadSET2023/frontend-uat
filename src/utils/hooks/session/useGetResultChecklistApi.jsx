import React, { useEffect, useRef, useState } from "react";
import { getSessionResult } from "@/utils/api/SessionAPI";

const useGetResultChecklistApi = ({
  sessionId,
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [data, setData] = useState([]);
  const [loadingState, setLoadingState] = useState("pending");
  const initialized = useRef(false);

  const handleGetResultChecklist = async () => {
    try {
      setLoadingState("loading");
      const res = await getSessionResult(sessionId);
      setData(res?.data?.data || []);
      setLoadingState("success");
      onSuccess();
    } catch (error) {
      setLoadingState("error");
      onError();
    }
  };

  useEffect(() => {
    if (!initialized.current && sessionId) {
      initialized.current = true;
      handleGetResultChecklist();
    }
  }, [sessionId]);

  return {
    data,
    loadingState,
    handleGetResultChecklist,
  };
};

export default useGetResultChecklistApi;
