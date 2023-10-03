import React, { useEffect, useState } from "react";
import AuthTitle from "@/components/reusables/AuthTitle";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router";
import TokenFormTester from "./TokenFormTester";

const TokenVerificationTester = () => {
  const [testerTokenVerified, setTesterTokenVerified] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (testerTokenVerified === "invalid") {
      toast({
        title: "Invalid token",
        description: "Wait 30 seconds before requesting a new token.",
        duration: 60000,
        status: "error",
        variant: "destructive",
        action: <ToastAction altText="Resend token">Resend</ToastAction>,
      });
    } else if (testerTokenVerified === "verified") {
      toast({
        title: "Email verified",
        description: "Proceed with login.",
        status: "success",
      });
      setTimeout(() => {
        navigate("/tester");
      }, 3000);
    }
    return () => {
      setTesterTokenVerified("");
    };
  }, [testerTokenVerified]);

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="w-[22rem] flex flex-col justify-between gap-6">
        <AuthTitle
          title="nextest"
          subtitle="Welcome bug catcher!"
          showBadge={true}
        />

        <TokenFormTester setTokenVerified={setTesterTokenVerified} />
      </div>
    </div>
  );
};

export default TokenVerificationTester;
