import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateOrg from "@/utils/hooks/organization/useCreateOrg";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router";

const organizationFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  website: z.string().url("Invalid URL"),
  staffCounts: z.string().nonempty("Staff counts is required"),
});

const OrganizationForm = () => {
  const organizationForm = useForm({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      website: "",
      staffCounts: "",
    },
  });
  const { loadingState, handleCreateOrg } = useCreateOrg({
    form: organizationForm,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (loadingState === "success") {
      toast({
        title: "Organization registered",
        description: "Your organization has been registered successfully.",
        status: "success",
      });
    } else if (loadingState === "error") {
      toast({
        title: "Error",
        description:
          "Organization registration unsuccessful. Please try again.",
        status: "error",
        variant: "destructive",
      });
    }
  }, [loadingState]);

  return (
    <Form {...organizationForm}>
      <form
        onSubmit={organizationForm.handleSubmit(handleCreateOrg)}
        className="flex flex-col gap-4">
        <FormField
          control={organizationForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input type="name" placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={organizationForm.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://www.example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={organizationForm.control}
          name="staffCounts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff counts</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of staffs" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Number of staffs</SelectLabel>
                    <SelectItem value="micro">Less than 10</SelectItem>
                    <SelectItem value="small">10 - 49</SelectItem>
                    <SelectItem value="medium">50 - 249</SelectItem>
                    <SelectItem value="large">More than 250</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={loadingState === "loading" || loadingState === "success"}>
          {loadingState === "loading"
            ? "Registering..."
            : loadingState === "success"
            ? "Organization registered!"
            : "Register organization"}
        </Button>
      </form>
    </Form>
  );
};

export default OrganizationForm;
