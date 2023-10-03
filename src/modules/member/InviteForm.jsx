import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";

const InviteForm = ({ form, submitHandler }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "email",
  });

  useEffect(() => {
    form.reset({
      email: [""],
    });
  }, []);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="flex flex-col gap-4"
      >
        <FormLabel>Email</FormLabel>
        <ul className="space-y-2">
          {fields.map((member, index) => (
            <FormItem key={index}>
              <li
                className="flex flex-row items-center space-x-2"
                key={member.id}
              >
                <Input
                  type="email"
                  placeholder="o@mail.com"
                  id={`member-${index}`}
                  defaultValue={member.value}
                  {...form.register(`email.${index}`)}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    }
                  }}
                >
                  <Trash2 strokeWidth={1.25} type="button" />
                </Button>
              </li>

              <FormMessage />
            </FormItem>
          ))}
          <Button variant="outline" type="button" onClick={() => append()}>
            Add email
          </Button>
        </ul>
      </form>
    </Form>
  );
};

export default InviteForm;
