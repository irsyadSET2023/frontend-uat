import React, { useEffect, useState } from "react";
import AuthTitle from "@/components/reusables/AuthTitle";
import LeadText from "@/components/reusables/LeadText";
import RegisterForm from "../RegisterForm";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonVariants } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthApi from "@/utils/hooks/auth/useAuthApi";
import { checkToken } from "@/utils/api/AuthAPI";
import { Loader2 } from "lucide-react";

const registerAdminFormSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    username: z.string().min(3, "Username must be at least 3 characters long."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

const RegisterMember = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState();
  const [fetchDataState, setFetchDataState] = useState("pending");
  const registerForm = useForm({
    resolver: zodResolver(registerAdminFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { loadingState, handleRegisterMember } = useAuthApi({
    form: registerForm,
  });

  const fetchUserData = async () => {
    const token = searchParams.get("token");
    try {
      setFetchDataState("loading");
      const res = await checkToken(token);
      setUserData(res.data.data);
      registerForm.setValue("email", res.data.data.user.email);
      setFetchDataState("success");
    } catch (error) {
      setFetchDataState("error");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      {fetchDataState === "loading" ? (
        <div className="w-[22rem] flex flex-col justify-between items-center gap-6">
          <Loader2 size={64} className="animate-spin" />
        </div>
      ) : (
        <div className="w-[22rem] flex flex-col justify-between gap-6">
          <AuthTitle
            title={`${userData?.organization?.name}`}
            subtitle="Hunting bug made easier."
          />
          <RegisterForm
            form={registerForm}
            handleRegister={handleRegisterMember}
            token={searchParams.get("token")}
            registerState={loadingState}
            email={userData?.user?.email}
          />
          <LeadText>EXISTING USER?</LeadText>
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default RegisterMember;
