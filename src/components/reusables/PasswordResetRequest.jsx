import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthApi from "@/utils/hooks/auth/useAuthApi";
import { Loader2 } from "lucide-react";

const PasswordResetRequest = () => {
  const passwordResetSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  const passwordResetForm = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const { loadingState, handleRequestResetPassword } = useAuthApi({
    form: passwordResetForm,
  });
  const [open, setOpen] = useState(false);

  const onSubmit = (formData) => {
    handleRequestResetPassword(formData);
  };

  useEffect(() => {
    if (loadingState === "success") {
      setOpen(false);
    }
  }, [loadingState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Forgot your password?</DialogTrigger>
      <DialogContent>
        <DialogHeader>Reset your password</DialogHeader>
        <DialogDescription className="-mt-2">
          Enter your email to get a password reset link sent to your email
          inbox.
        </DialogDescription>
        <Form {...passwordResetForm}>
          <form onSubmit={passwordResetForm.handleSubmit(onSubmit)}>
            <FormField
              control={passwordResetForm.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="example@mail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              disabled={loadingState === "loading"}
              className="w-full mt-2"
            >
              {loadingState === "loading" ? (
                <Loader2 size={20} className="animate-spin mr-2" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetRequest;
