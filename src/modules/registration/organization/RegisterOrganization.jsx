import React from "react";
import AuthTitle from "@/components/reusables/AuthTitle";
import OrganizationForm from "./OrganizationForm";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const RegisterOrganization = () => {
  const { account, authLoading } = useAuthContext();

  if (account?.organizationId) {
    return <Navigate to="/app" />;
  } else if (!account?.id) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col justify-center items-center w-screen min-h-screen">
      {authLoading ? (
        <>
          <AuthTitle title="nextest" subtitle={`Welcome`} />
          <Loader2 size={48} className="animate-spin mt-8" />
        </>
      ) : (
        <>
          <div className="w-[22rem] flex flex-col justify-between gap-6">
            <AuthTitle
              title="Organization details"
              subtitle={`Welcome ${account.username}`}
            />
            <OrganizationForm />
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterOrganization;
