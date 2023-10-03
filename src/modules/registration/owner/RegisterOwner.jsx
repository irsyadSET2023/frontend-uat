import React from "react";
import AuthTitle from "@/components/reusables/AuthTitle";
import LeadText from "@/components/reusables/LeadText";
import RegisterForm from "../RegisterForm";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthApi from "@/utils/hooks/auth/useAuthApi";

const registerFormSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long."),
    email: z.string().email("Invalid email address."),
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

const RegisterOwner = () => {
  const registerForm = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { loadingState, handleRegister } = useAuthApi({ form: registerForm });

  return (
    <div className="flex justify-center items-center w-screen min-h-screen">
      <div className="w-[22rem] flex flex-col justify-between gap-6">
        <AuthTitle title="nextest" subtitle="Hunting bug made easier." />
        <RegisterForm
          form={registerForm}
          handleRegister={handleRegister}
          registerState={loadingState}
          registerButtonLabel="Register"
          buttonText="Register"
        />
        <LeadText>EXISTING USER?</LeadText>
        <Link to="/" className={buttonVariants({ variant: "outline" })}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterOwner;
