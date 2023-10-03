import React, { useEffect, useState } from "react";
import AuthTitle from "@/components/reusables/AuthTitle";
import TokenForm from "./TokenForm";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router";

const TokenVerification = () => {
  const [ownerTokenVerified, setOwnerTokenVerified] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (ownerTokenVerified === "invalid") {
      toast({
        title: "Invalid token",
        description: "Wait 30 seconds before requesting a new token.",
        duration: 60000,
        status: "error",
        variant: "destructive",
        action: <ToastAction altText="Resend token">Resend</ToastAction>,
      });
    } else if (ownerTokenVerified === "verified") {
      toast({
        title: "Email verified",
        description: "Proceed with login.",
        status: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
    return () => {
      setOwnerTokenVerified("");
    };
  }, [ownerTokenVerified]);

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="w-[22rem] flex flex-col justify-between gap-6">
        <AuthTitle title="nextest" subtitle="Hunting bug made easier." />

        <TokenForm setTokenVerified={setOwnerTokenVerified} />
      </div>
    </div>
  );
};

export default TokenVerification;
