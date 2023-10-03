import React, { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Monitor, Smartphone, Trash2 } from "lucide-react";
import useCreateProjectApi from "@/utils/hooks/project/useCreateProjectApi";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  projectIcon: z
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
          "Invalid file extension for projectIcon. Supported extensions are jpg, png, jpeg, gif.",
      }
    ),
  projectType: z.string(),
  projectUrl: z
    .array(z.string().url("Invalid URL format."))
    .refine((value) => value.length > 0, {
      message: "At least one project URL is required.",
    }),
});

const ProjectDrawer = ({ refetch }) => {
  const [createProjectState, setCreateProjectState] = useState("pending");
  const [file, setfile] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "halo",
      projectIcon: "https://v5.reactrouter.com/web/example/url-params",
      projectType: "Web App",
      projectUrl: [],
    },
  });

  const { loadingState, handleCreateProject } = useCreateProjectApi({
    form: projectForm,
    onSuccess: () => {
      refetch();
    },
  });

  const buttonStyle1 =
    "flex p-4 flex-col items-center gap-[12px] flex-1 border-[2px] border-[#F4F4F5] h-[80px] w-full";

  const { fields, append, remove } = useFieldArray({
    control: projectForm.control,
    name: "projectUrl",
  });

  useEffect(() => {
    projectForm.reset({
      //
      name: "",
      projectIcon: "",
      projectType: "Web App",
      projectUrl: [""],
    });
  }, [createProjectState]);
  const errors = projectForm.formState.errors;
  return (
    <>
      <SheetContent className="flex flex-col gap-6">
        <SheetHeader>
          <SheetTitle>Create new project</SheetTitle>
          <SheetDescription>
            Fill in the details for a new project
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <Form {...projectForm}>
          <form
            className="flex-grow gap-4 flex flex-col"
            onSubmit={projectForm.handleSubmit((data) => {
              const formData = new FormData();
              formData.append("project-icon", file);
              formData.append("name", data.name);
              formData.append("projectType", data.projectType);
              formData.append("picture", data.picture);
              data.projectUrl.forEach((url, index) => {
                formData.append(`projectUrl[${index}]`, url);
              });
              handleCreateProject(formData);
            })}
          >
            <FormField
              control={projectForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn.co" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={projectForm.control}
              name="projectIcon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Icon</FormLabel>
                  <FormControl>
                    <Input
                      className="hover:cursor-pointer"
                      type="file"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        const file = event.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setImageBlob(e.target.result);
                          };
                          setfile(file);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={projectForm.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center gap-[16px] self-stretch">
                      <Button
                        type="button"
                        variant="outline"
                        className={
                          projectForm.watch().projectType === "Web App"
                            ? `${buttonStyle1} border-[#18181B]`
                            : buttonStyle1
                        }
                        onClick={() => field.onChange("Web App")}
                      >
                        <Monitor strokeWidth={1.5} width={16} height={16} />
                        <p className="small font-[400] text-[11px]">Web app</p>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className={
                          projectForm.watch().projectType === "Mobile App"
                            ? `${buttonStyle1} border-[#18181B]`
                            : buttonStyle1
                        }
                        onClick={() => field.onChange("Mobile App")}
                      >
                        <Smartphone strokeWidth={1.5} width={16} height={16} />
                        <p className="small font-[400] text-[11px]">
                          Mobile app
                        </p>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className={
                          projectForm.watch().projectType === "Both"
                            ? `${buttonStyle1} border-[#18181B]`
                            : buttonStyle1
                        }
                        onClick={() => field.onChange("Both")}
                      >
                        <div className="flex flex-row">
                          <Monitor strokeWidth={1.5} width={16} height={16} />
                          <Smartphone
                            strokeWidth={1.5}
                            width={16}
                            height={16}
                          />
                        </div>
                        <p className="small font-[400] text-[11px]">Both</p>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>URL</FormLabel>
              <FormDescription className="text-xs">
                Add links to your projects
              </FormDescription>
              <ul className="space-y-2">
                {fields.map((url, index) => (
                  <FormItem key={index}>
                    <li
                      className="flex flex-row items-center space-x-2"
                      key={url.id}
                    >
                      <Input
                        type="text"
                        id={`url-${index}`}
                        placeholder="https://edu.adnexio.jobs"
                        defaultValue={url.value}
                        {...projectForm.register(`projectUrl.${index}`)}
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
                    {errors.projectUrl && errors?.projectUrl[index] && (
                      <FormMessage>
                        {errors?.projectUrl[index].message}
                      </FormMessage>
                    )}
                  </FormItem>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => append()}
                >
                  Add URL
                </Button>
              </ul>
            </div>
            <SheetFooter className="grow">
              {loadingState === "loading" ? (
                <Button disabled className="w-full mt-auto">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Project...
                </Button>
              ) : (
                <Button className="w-full bg-[#18181B] text-[#FAFAFA] mt-auto">
                  Create Project
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </>
  );
};

export default ProjectDrawer;
