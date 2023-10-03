import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/reusables/Combobox";

const EditMemberForm = ({ projectData, form, submitHandler = () => {} }) => {
  return (
    <Form {...form}>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <FormField
          disabled
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input type="text" placeholder="Username" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input type="text" placeholder="Email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="projectsAssigned"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Projects</FormLabel>
                <FormControl>
                  <Combobox
                    placeholder="Select project..."
                    searchPlaceholder="Search projects..."
                    data={projectData}
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

export default EditMemberForm;
