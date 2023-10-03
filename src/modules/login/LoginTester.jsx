import AuthTitle from "@/components/reusables/AuthTitle";

import React, { useEffect } from "react";
import LeadText from "@/components/reusables/LeadText";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import LoginFormTester from "./LoginFormTester";
import Cookies from "universal-cookie";

const LoginTester = () => {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (cookie.get("testerToken")) {
      navigate(location?.state?.from?.pathname || "/tester/session");
    }
  }, [cookie]);
  return (
    <>
      <div className="flex justify-center items-center w-screen min-h-screen">
        <div className="w-[22rem] flex flex-col justify-between gap-6">
          <AuthTitle
            title="nextest"
            subtitle="Welcome bug catcher!"
            showBadge={true}
          />
          <LoginFormTester buttonText="Sign in as tester" />
          <LeadText>START NEW TESTER ACCOUNT</LeadText>
          <Link
            to="/tester/register"
            className={buttonVariants({ variant: "outline" })}
          >
            Register new tester
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginTester;
