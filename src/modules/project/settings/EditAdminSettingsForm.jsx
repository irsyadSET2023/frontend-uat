import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AdminCombobox } from "@/components/reusables/AdminCombobox";

const EditAdminSettingsForm = ({
  projectData,
  form,
  submitHandler = () => {},
}) => {
  return (
    <Form {...form}>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <FormField
          name="adminPerms"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <AdminCombobox data={projectData} field={field} />
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

export default EditAdminSettingsForm;
