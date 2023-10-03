import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import useAuthApi from "@/utils/hooks/auth/useAuthApi";

const tokenFormSchema = z.object({
  token: z.string().length(8, "Token must be 8 digits"),
});

const TokenFormTester = ({ setTokenVerified }) => {
  const tokenForm = useForm({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      token: "",
    },
  });
  const { loadingState, handleVerifyTester } = useAuthApi(tokenForm);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const onSubmit = async ({ token }) => {
    try {
      const res = await handleVerifyTester({ token, email });
      setTokenVerified("verified");
    } catch (error) {
      setTokenVerified("invalid");
    }
  };

  return (
    <Form {...tokenForm}>
      <form
        onSubmit={tokenForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={tokenForm.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>8 digit token</FormLabel>
              <FormControl>
                <Input type="token" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="muted">
          Please check your email for an 8-digit verification token to confirm
          your email address.
        </p>

        <Button
          disabled={loadingState === "loading" || loadingState === "success"}
        >
          {loadingState === "loading"
            ? "Verifying..."
            : loadingState === "success"
            ? "Verified successfully!"
            : "Verify email"}
        </Button>
      </form>
    </Form>
  );
};

export default TokenFormTester;
