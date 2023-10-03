import React from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthApi from "@/utils/hooks/auth/useAuthApi";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PasswordResetForm = () => {
  const passwordResetSchema = z.object({
    password: z.string().nonempty("Password is required"),
    confirmPassword: z
      .string()
      .nonempty("Please confirm your password")
      .refine((data) => data.password === data.confirmPassword, {
        message: "Password does not match",
        path: ["confirmPassword"],
      }),
  });

  const passwordResetForm = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [searchParams] = useSearchParams();
  const userToken = searchParams.get("token");

  const { loadingState, handleResetPassword } = useAuthApi({
    form: passwordResetForm,
  });
  const onSubmit = (formData) => {
    handleResetPassword({ token: userToken, password: formData?.password });
  };

  return (
    <Form {...passwordResetForm}>
      <form
        onSubmit={passwordResetForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={passwordResetForm.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={passwordResetForm.control}
          name="confirmPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button disabled={loadingState === "loading"} className="w-full mt-2">
          {loadingState === "loading" ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordResetForm;
