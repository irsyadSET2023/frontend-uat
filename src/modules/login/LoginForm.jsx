import React from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthApi from "@/utils/hooks/auth/useAuthApi";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().nonempty("Password is required."),
});

const LoginForm = ({ buttonText }) => {
  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { loadingState, handleLogin } = useAuthApi({
    form: loginForm,
  });

  return (
    <>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={loadingState === "loading" || loadingState === "success"}
          >
            {loadingState === "loading"
              ? "Signing in..."
              : loadingState === "success"
              ? "Signed in successfully! Redirecting..."
              : buttonText}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
