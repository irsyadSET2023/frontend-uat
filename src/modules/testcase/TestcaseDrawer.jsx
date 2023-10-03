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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, Loader2, XSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Wysiwyg from "@/components/reusables/Wysiwyg";
import useCreateTestcaseApi from "@/utils/hooks/testcase/useCreateTestcaseApi";
import { useProjectContext } from "@/context/ProjectContext";
import { useScenarioContext } from "@/context/ScenarioContext";
import useDeleteTestcaseApi from "@/utils/hooks/testcase/useDeleteTestcaseApi";
import useViewTestcaseApi from "@/utils/hooks/testcase/useViewTestcaseApi";
import useUpdateTestcaseApi from "@/utils/hooks/testcase/useUpdateTestcaseApi";
import ImageTile from "@/components/reusables/ImageTile";
import useProjectPermission from "@/utils/hooks/auth/usePermission";

const TestcaseDrawer = ({ id, open, setOpen, refetch, duplicate }) => {
  const { projectId } = useProjectContext();
  const { scenarioId, refetchScenario } = useScenarioContext();
  const canEdit = useProjectPermission();

  const { data } = useViewTestcaseApi({
    projectId,
    scenarioId,
    testcaseId: id,
    enabled: open,
  });
  const testcaseSchema = z.object({
    name: z
      .string()
      .min(1, "Checklist name is required.")
      .max(40, "Maximum of 40 characters only."),
    description: z.string().min(1, "Checklist description is required."),
    type: z.string(),
    stepDetails: z.string().min(1, "Step detail(s) are required."),
    expectedResults: z.string().min(1, "Expected result(s) are required."),
    screenshot: z
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
  });

  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [imageBlobs, setImageBlobs] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setImageBlobs(data?.testCaseImagesUrl || []);
  }, [data]);

  const buttonStyle1 =
    "flex p-4 flex-col items-center gap-[12px] flex-1 border-[2px] border-[#F4F4F5] h-[80px] w-full";
  const testcaseForm = useForm({
    resolver: zodResolver(testcaseSchema),
    values: {
      name:
        duplicate && data?.name
          ? data?.name + " - copy"
          : data?.name
          ? data?.name
          : "",
      description: data?.description || "",
      type: data?.type || "positive",
      stepDetails: data?.stepDetails || "",
      expectedResults: data?.expectedResults || "",
      screenshot: data?.screenshots || "",
    },
  });
  const { loadingState: createLoading, handleCreateTestcase } =
    useCreateTestcaseApi({
      testcaseForm,
      projectId,
      scenarioId,
      onSuccess: () => {
        testcaseForm.reset();
        setImageBlobs(null);
        refetch();
        refetchScenario();
        setOpen(false);
      },
    });
  const { handleDeleteTestcase } = useDeleteTestcaseApi({
    projectId,
    scenarioId,
    testcaseId: id,
    onSuccess: () => {
      refetch();
      setOpen(false);
    },
  });
  const { handleUpdateTestcase } = useUpdateTestcaseApi({
    projectId,
    scenarioId,
    testcaseId: id,
    onSuccess: () => {
      refetch();
      setOpen(false);
    },
  });

  const handleDeleteButton = () => {
    if (isDeleteConfirmed) {
      handleDeleteTestcase();
      setIsDeleteConfirmed(false);
    } else {
      setIsDeleteConfirmed(true);
    }
  };

  useEffect(() => {
    return () => {
      testcaseForm.reset();
      setImageBlobs([]);
      setFiles([]);
    };
  }, [open]);

  return (
    <>
      <SheetContent
        enableFullscreen
        open={open}
        className="h-full gap-[8px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>
            {id && !duplicate ? "Edit test case" : "Create new test case"}
          </SheetTitle>
          <SheetDescription>
            {id && !duplicate ? null : "Fill in details for a new test case"}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <Form {...testcaseForm}>
          <form
            className="h-full gap-[8px] flex flex-col"
            onSubmit={testcaseForm.handleSubmit((data) => {
              const formData = new FormData();
              files.forEach((file) => {
                formData.append(`test-case-screenshots`, file);
              });
              formData.append("name", data.name);
              formData.append("description", data.description);
              formData.append("type", data.type);
              formData.append("stepDetails", data.stepDetails);
              formData.append("expectedResults", data.expectedResults);
              formData.append("screenshot", data.screenshot);
              id && !duplicate
                ? handleUpdateTestcase(formData)
                : handleCreateTestcase(formData);
            })}
          >
            <FormField
              control={testcaseForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={40}
                      disabled={!canEdit}
                    ></Input>
                  </FormControl>
                  <p className="muted flex justify-end">
                    {field.value.length}/40
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={testcaseForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center gap-[16px] self-stretch">
                      <Button
                        type="button"
                        variant="outline"
                        className={
                          testcaseForm.watch().type === "positive"
                            ? `${buttonStyle1} border-[#18181B]`
                            : buttonStyle1
                        }
                        onClick={() =>
                          canEdit ? field.onChange("positive") : null
                        }
                      >
                        <CheckSquare strokeWidth={1.5} width={16} height={16} />
                        <p className="small font-[400] text-[12px]">Positive</p>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className={
                          testcaseForm.watch().type === "negative"
                            ? `${buttonStyle1} border-[#18181B]`
                            : buttonStyle1
                        }
                        onClick={() =>
                          canEdit ? field.onChange("negative") : null
                        }
                      >
                        <XSquare strokeWidth={1.5} width={16} height={16} />
                        <p className="small font-[400] text-[12px]">Negative</p>
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Positive test cases verify that the software works correctly
                    under expected conditions, while negative test cases checks
                    how it handles errors and unexpected situations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={testcaseForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={!canEdit}></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={testcaseForm.control}
              name="stepDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Step details</FormLabel>
                  <FormControl>
                    <Wysiwyg {...field} readOnly={!canEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={testcaseForm.control}
              name="expectedResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected results</FormLabel>
                  <FormControl>
                    <Wysiwyg {...field} readOnly={!canEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={testcaseForm.control}
              name="screenshot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screenshot</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!canEdit}
                      className="hover:cursor-pointer"
                      type="file"
                      multiple // Allow multiple file selection
                      onChange={(event) => {
                        field.onChange(event);
                        const files = event.target.files;

                        // Process each selected file
                        const blobPromises = [];
                        const filesArr = [];
                        for (let i = 0; i < files.length; i++) {
                          const file = files[i];
                          const reader = new FileReader();

                          // Use promises to handle asynchronous loading of images
                          const promise = new Promise((resolve) => {
                            reader.onload = (e) => {
                              resolve(e.target.result);
                            };
                          });
                          filesArr.push(file);

                          reader.readAsDataURL(file);
                          blobPromises.push(promise);
                        }

                        setFiles(filesArr);

                        // When all promises resolve, update the image previews
                        Promise.all(blobPromises).then((blobArray) => {
                          setImageBlobs([...imageBlobs, ...blobArray]);
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-[8px]">
              {imageBlobs && imageBlobs.length > 0 ? (
                imageBlobs.map((blob, index) => (
                  <div key={index}>
                    <ImageTile src={blob} alt={`Screenshot ${index}`} />
                  </div>
                ))
              ) : (
                <p>No screenshots available</p> // Display a message or placeholder
              )}
            </div>

            <SheetFooter className="mt-4 pb-4">
              {canEdit && (
                <>
                  {createLoading === "loading" ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating testcase...
                    </Button>
                  ) : (
                    <Button className="w-full bg-[#18181B] text-[#FAFAFA] mt-auto">
                      {id && !duplicate ? "Save" : "Create test case"}
                    </Button>
                  )}
                  <div className="flex flex-col gap-[8px]">
                    {id && !duplicate && (
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={handleDeleteButton}
                        type="button"
                      >
                        {isDeleteConfirmed
                          ? "Confirm delete testcase?"
                          : "Delete testcase"}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </>
  );
};

export default TestcaseDrawer;
