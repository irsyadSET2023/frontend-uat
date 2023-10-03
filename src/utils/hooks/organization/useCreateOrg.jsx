import React, { useEffect, useState } from "react";
import { registerOrganization } from "@/utils/api/OrgAPI";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const useCreateOrg = ({ form }) => {
  const [loadingState, setLoadingState] = useState("pending");
  const { getAccount } = useAuthContext();
  const navigate = useNavigate();

  const handleCreateOrg = async (formData) => {
    try {
      setLoadingState("loading");
      await registerOrganization(formData);
      await getAccount();
      setLoadingState("success");
    } catch (error) {
      setLoadingState("error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (loadingState === "success") {
      navigate("/app");
    }
  }, [loadingState]);

  return { loadingState, handleCreateOrg };
};

export default useCreateOrg;
