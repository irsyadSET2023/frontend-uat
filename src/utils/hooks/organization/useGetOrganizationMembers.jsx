import React, { useEffect, useRef, useState } from "react";
import { getOrganizationMember } from "@/utils/api/OrgAPI";
import { useToast } from "@/components/ui/use-toast";

const useGetOrganizationMember = (pageInfo, enabled = false) => {
  const [loadingState, setLoadingState] = useState("pending");
  const [data, setData] = useState([]);
  const initialized = useRef(false);
  const { toast } = useToast();

  const handleGetOrganizationMember = async (isVerified) => {
    try {
      setData([]);
      setLoadingState("loading");
      const res = await getOrganizationMember(
        isVerified,
        pageInfo.page,
        pageInfo.pageSize
      );
      if (!isVerified) {
        setData(res?.data?.data || []);
      } else {
        setData(res?.data?.data || []);
      }
      setLoadingState("success");
    } catch (error) {
      toast({
        title: "Error",
        description: "View members unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
    } finally {
      setLoadingState("pending");
    }
  };

  useEffect(() => {
    if (enabled) {
      if (!initialized.current) {
        initialized.current = true;
        return;
      }
      handleGetOrganizationMember(true);
    }
  }, []);

  return {
    loadingState,
    data,
    handleGetOrganizationMember,
  };
};

export default useGetOrganizationMember;
