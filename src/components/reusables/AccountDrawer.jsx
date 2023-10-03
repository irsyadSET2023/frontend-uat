import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { set, useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuthContext } from "@/context/AuthContext";
import useUpdateUserApi from "@/utils/hooks/user/useUpdateUserApi";
import ImageTile from "./ImageTile";

const profileSchema = z.object({
  profilePicture: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          const allowedExtensions = ["jpg", "png", "jpeg", "gif", "svg"];
          const fileExtension = value.split(".").pop().toLowerCase();
          return allowedExtensions.includes(fileExtension);
        }
        return true;
      },
      {
        message:
          "Invalid file extension for projectIcon. Supported extensions are jpg, png, jpeg, svg, gif.",
      }
    ),
});

const securitySchema = z
  .object({
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
const AccountDrawer = ({ setOpen }) => {
  const { account, getAccount } = useAuthContext();

  const [imageBlob, setImageBlob] = useState(
    account?.profilePictureUrl || null
  );
  const [file, setFile] = useState(null);
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    // take from context
    defaultValues: {
      username: account?.username || "",
      email: account?.email || "",
      profilePicture: "",
    },
  });

  const securityForm = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { updateUserState, handleUpdateUser } = useUpdateUserApi({
    securityForm,
    onSuccess: () => {
      getAccount();
    },
  });

  return (
    <>
      <SheetHeader>
        <SheetTitle>Account Settings</SheetTitle>
        <SheetDescription>
          Make changes to your profile. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Form {...profileForm}>
            <form
              className="h-full gap-4 flex flex-col"
              onSubmit={profileForm.handleSubmit((data) => {
                const formData = new FormData();
                formData.append("profile-picture", file);
                handleUpdateUser(formData);
              })}
            >
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input disabled value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imageBlob && <ImageTile src={imageBlob} />}
              <FormField
                control={profileForm.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="hover:cursor-pointer"
                        type="file"
                        onChange={(event) => {
                          field.onChange(event);
                          const file = event.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setFile(file);
                              setImageBlob(e.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="grow">
                <Button
                  disabled={!profileForm.formState.isDirty}
                  className="w-full bg-[#18181B] text-[#FAFAFA]"
                >
                  Save Changes
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="security">
          <Form {...securityForm}>
            <form
              className="h-full gap-4 flex flex-col"
              onSubmit={securityForm.handleSubmit((data) => {
                handleUpdateUser({ password: data.password });
                setOpen(false);
              })}
            >
              <FormField
                control={securityForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={securityForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="grow">
                <Button
                  disabled={!securityForm.formState.isDirty}
                  className="w-full bg-[#18181B] text-[#FAFAFA]"
                >
                  Save Changes
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AccountDrawer;
