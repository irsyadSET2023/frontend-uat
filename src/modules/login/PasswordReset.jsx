import React from "react";
import AuthTitle from "@/components/reusables/AuthTitle";
import LeadText from "@/components/reusables/LeadText";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import PasswordResetForm from "./PasswordResetForm";

const PasswordReset = () => {
  return (
    <>
      <div className="flex justify-center items-center w-screen min-h-screen">
        <div className="w-[22rem] flex flex-col justify-between gap-6">
          <AuthTitle title="nextest" subtitle="Hunting bug made easier." />
          <div>
            <PasswordResetForm />
          </div>
          <LeadText>RETURN TO LOGIN</LeadText>
          <Link to="/login" className={buttonVariants({ variant: "outline" })}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
