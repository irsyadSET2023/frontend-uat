import React, { useEffect } from "react";
import AuthTitle from "@/components/reusables/AuthTitle";
import LoginForm from "./LoginForm";
import { buttonVariants } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LeadText from "@/components/reusables/LeadText";
import Cookies from "universal-cookie";
import PasswordResetRequest from "@/components/reusables/PasswordResetRequest";

const Login = () => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (cookie.get("token")) {
      navigate(location?.state?.from?.pathname || "/app");
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-screen min-h-screen">
        <div className="w-[22rem] flex flex-col justify-between gap-6">
          <AuthTitle title="nextest" subtitle="Hunting bug made easier." />
          <div>
            <LoginForm buttonText="Sign in with email" />
            <div className="w-full text-center mt-2">
              <PasswordResetRequest />
            </div>
          </div>
          <LeadText>START NEW ACCOUNT</LeadText>
          <Link
            to="/register"
            className={buttonVariants({ variant: "outline" })}
          >
            Register new organisation
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
