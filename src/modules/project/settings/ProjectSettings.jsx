import React, { useEffect, useState } from "react";
import Settings from "./Settings";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Monitor, Smartphone, Trash2 } from "lucide-react";
import DeleteProject from "./DeleteProject";
import { useParams } from "react-router-dom";
import useUpdateProjectApi from "@/utils/hooks/project/useUpdateProjectApi";
import { useProjectContext } from "@/context/ProjectContext";
import useViewProjectApi from "@/utils/hooks/project/useViewProjectApi";
import ImageTile from "@/components/reusables/ImageTile";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  projectIconUrl: z
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

const ProjectSettings = () => {
  const params = useParams();
  const projectId = params?.id;
  const { data } = useViewProjectApi({ projectId, enabled: true });
  const [imageBlob, setImageBlob] = useState(null);
  const [open, setOpen] = useState(false);
  const { refetchProjects } = useProjectContext();
  const [file, setFile] = useState(null);

  useEffect(() => {
    setImageBlob(data?.projectIconUrl);
  }, [data]);

  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    values: {
      name: data ? data?.name : "",

      projectType: data ? data?.projectType : "web",
      projectUrl: data ? data?.projectUrl : [],
    },
  });

  const { loadingState, handleUpdateProject } = useUpdateProjectApi({
    form: projectForm,
    onSuccess: () => refetchProjects(),
    onError: () => console.log("error"),
  });

  const buttonStyle1 =
    "flex p-4 flex-col items-center gap-[11px] flex-1 border-[2px] border-[#F4F4F5] h-[80px] w-full";
  const { fields, append, remove } = useFieldArray({
    control: projectForm.control,
    name: "projectUrl",
  });

  const errors = projectForm.formState.errors;

  return (
    <>
      <Settings
        key={data}
        title="Project"
        subtitle="This is how admin will see the project."
      >
        <div className="max-w-[672px] space-y-[32px]">
          <Form {...projectForm}>
            <form
              className="h-full gap-6 flex flex-col"
              onSubmit={projectForm.handleSubmit((data) => {
                const formData = new FormData();
                formData.append("project-icon", file);
                formData.append("name", data.name);
                formData.append("projectType", data.projectType);
                formData.append("picture", data.picture);
                // Append projectUrls from field array
                data.projectUrl.forEach((url, index) => {
                  formData.append(`projectUrl[${index}]`, url);
                });

                handleUpdateProject(projectId, formData);
              })}
            >
              <FormField
                control={projectForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>{imageBlob && <ImageTile src={imageBlob} />}</div>
              <FormField
                control={projectForm.control}
                name="projectIcon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Icon</FormLabel>
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
                          <p className="small font-[400] text-[11px]">
                            Web app
                          </p>
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
                          <Smartphone
                            strokeWidth={1.5}
                            width={16}
                            height={16}
                          />
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
              {loadingState === "loading" ? (
                <Button disabled className="w-fit">
                  <Loader2 className="w-fit mr-2 h-4 animate-spin" />
                  Updating project
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-fit bg-[#18181B] text-[#FAFAFA] mt-auto"
                >
                  Update project
                </Button>
              )}
            </form>
          </Form>
          <Sheet open={open} onOpenChange={setOpen}>
            <div>
              <h3 className="large font-[500]">Danger zone</h3>
              <p className="muted text-[14px] font-[400]">
                Please be careful if you want to execute this
              </p>
              <SheetTrigger asChild>
                <Button variant="destructive" className="mt-[16px]">
                  Delete project
                </Button>
              </SheetTrigger>
            </div>
            <SheetContent className="space-y-2">
              <DeleteProject
                projectName={data?.name}
                projectId={projectId}
                setOpen={setOpen}
              />
            </SheetContent>
          </Sheet>
        </div>
      </Settings>
    </>
  );
};

export default ProjectSettings;
