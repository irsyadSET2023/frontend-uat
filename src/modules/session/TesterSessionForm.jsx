import React, { useEffect, useState } from "react";
import TesterSessionHeader from "@/components/reusables/TesterSessionHeader";
import TesterSessionFooter from "@/components/reusables/TesterSessionFooter";
import TesterTestcaseDetails from "@/components/reusables/TesterTestcaseDetails";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { CheckSquare, XSquare } from "lucide-react";
import Wysiwyg from "@/components/reusables/Wysiwyg";
import pluralize from "pluralize";
import useGetStartTesterSessionApi from "@/utils/hooks/tester/useGetStartTesterSessionApi";
import { useParams } from "react-router";
import useSubmitTesterSessionApi from "@/utils/hooks/tester/useSubmitTesterSessionApi";
import useGetTesterSessionResultApi from "@/utils/hooks/tester/useGetTesterSessionResultApi";
import useUpdateTesterSessionApi from "@/utils/hooks/tester/useUpdateTesterSessionApi";
import { useAuthContext } from "@/context/AuthContext";

const TesterSessionForm = () => {
  const params = useParams();
  const { account } = useAuthContext();

  const { data: scenarioData, fetchSessionState } = useGetStartTesterSessionApi(
    { sessionId: params.id }
  );
  const { data: initialResult, handleGetTesterSessionResult } =
    useGetTesterSessionResultApi({
      sessionId: params.id,
    });
  const { handleSubmitTesterSession } = useSubmitTesterSessionApi({
    sessionId: params.id,
    onSuccess: () => {
      handleGetTesterSessionResult();
    },
  });
  const { handleUpdateTesterSession } = useUpdateTesterSessionApi({
    sessionId: params.id,
  });
  const [result, setResult] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    if (initialResult.length > 0) {
      const resultObject = {};
      initialResult.forEach((item) => {
        item.scenarios.map((scenario) => {
          scenario.test_cases.map((testcase) => {
            {
              resultObject[testcase?.id] = {
                result_id: testcase?.result?.id,
                status: testcase?.result?.status,
                remarks: testcase?.result?.remarks,
                screenshots: testcase?.result?.screenshots,
              };
            }
          });
        });
      });
      setResult(resultObject);
    }
  }, [initialResult]);

  const testcaseTotal = scenarioData[0]?.Scenarios.reduce(
    (acc, curr) => acc + curr.testcaseCount,
    0
  );

  const statusResultLength = (data) => {
    let count = 0;
    for (const key in data) {
      if (data[key].status) {
        count++;
      }
    }
    return count;
  };

  const submitHandler = () => {
    const resultArray = [];
    for (const key in result) {
      if (initialResult.length > 0 && result[key]?.result_id) {
        resultArray.push({
          id: result[key]?.result_id || null,
          testcaseId: parseInt(key),
          status: result[key]?.status,
          remarks: result[key]?.remarks,
          screenshots: result[key]?.screenshots,
        });
      } else {
        resultArray.push({
          testcaseId: parseInt(key),
          status: result[key]?.status,
          remarks: result[key]?.remarks,
          screenshots: result[key]?.screenshots,
        });
      }
    }
    let imgFiles = [];
    if (initialResult.length > 0) {
      const formData = new FormData();

      for (const [imgRef, imagesStore] of Object.entries(images)) {
        for (const [key, value] of Object.entries(imagesStore)) {
          imgFiles.push(value);
        }
      }
      imgFiles.forEach((imgFile) => {
        formData.append(imgFile.imgRef, imgFile);
      });

      const submissionData = JSON.stringify(resultArray);
      formData.append("data", submissionData);
      handleUpdateTesterSession(formData);
    } else {
      const formData = new FormData();

      for (const [imgRef, imagesStore] of Object.entries(images)) {
        for (const [key, value] of Object.entries(imagesStore)) {
          imgFiles.push(value);
        }
      }
      imgFiles.forEach((imgFile) => {
        formData.append(imgFile.imgRef, imgFile);
      });

      const submissionData = JSON.stringify(resultArray);
      formData.append("data", submissionData);
      handleSubmitTesterSession(formData);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <TesterSessionHeader title="Session Title" />

      {fetchSessionState === "success" && (
        <div className="py-6 px-8 mb-[88px]">
          {scenarioData.map((item, index) => {
            return (
              <div key={index} className="">
                <Accordion type="single" collapsible>
                  {item.Scenarios.map((scenario, index) => {
                    return (
                      <div key={index} className="">
                        <AccordionItem
                          value={scenario.name
                            .toLowerCase()
                            .replaceAll(" ", "-")}
                        >
                          <AccordionTrigger>
                            <div className="flex justify-between items-center">
                              <div className="flex flex-row items-center gap-2  ">
                                <p className="font-medium">{scenario.name}</p>
                                <Badge>
                                  {pluralize(
                                    "testcase",
                                    scenario.testcaseCount,
                                    true
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <TesterSessionTestcase
                              scenario={scenario}
                              result={result}
                              setResult={setResult}
                              images={images}
                              setImages={setImages}
                              account={account}
                              params={params}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </div>
                    );
                  })}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}

      <TesterSessionFooter
        submitHandler={submitHandler}
        completedTestcase={statusResultLength(result)}
        totalTestcase={testcaseTotal}
        buttonLabel={initialResult.length > 0 ? "Resubmit" : "Submit"}
      />
    </div>
  );
};

const TesterSessionTestcase = ({
  scenario,
  result,
  setResult,
  images,
  setImages,
  account,
  params,
}) => {
  return (
    <div className="border rounded">
      <Accordion type="single" collapsible>
        {scenario.test_cases.map((testcase, index) => {
          return (
            <AccordionItem
              key={index}
              value={testcase.name.toLowerCase().replaceAll(" ", "-")}
            >
              <AccordionTrigger className="px-4 border-b w-full -mb-[1px]">
                <div className="flex justify-between items-center">
                  <div className="flex flex-row items-center gap-2">
                    <p className="font-medium">{testcase.name}</p>
                    {testcase.type === "positive" ? (
                      <Badge variant="outline">
                        {testcase.type.charAt(0).toUpperCase() +
                          testcase.type.slice(1)}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        {testcase.type.charAt(0).toUpperCase() +
                          testcase.type.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 m-4 p-4 rounded bg-[#F4F4F5]">
                  <TesterTestcaseDetails testcase={testcase} />

                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Status</p>
                    <RadioGroup
                      value={result[scenario.test_cases[index].id]?.status}
                      onValueChange={(value) =>
                        setResult({
                          ...result,
                          [scenario.test_cases[index].id]: {
                            ...result[scenario.test_cases[index].id],
                            status: value,
                          },
                        })
                      }
                      className="flex"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-[88px]"
                        asChild
                      >
                        <RadioGroupItem value="passed" id="passed">
                          <div className="flex flex-col items-center gap-3">
                            <CheckSquare />
                            <p>Passed</p>
                          </div>
                        </RadioGroupItem>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full h-[88px]"
                        asChild
                      >
                        <RadioGroupItem value="failed" id="failed">
                          <div className="flex flex-col items-center gap-3">
                            <XSquare />
                            <p>Failed</p>
                          </div>
                        </RadioGroupItem>
                      </Button>
                    </RadioGroup>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Remarks</p>
                    <Wysiwyg
                      onChange={(value) => {
                        setResult({
                          ...result,
                          [scenario.test_cases[index].id]: {
                            ...result[scenario.test_cases[index].id],
                            remarks: value,
                          },
                        });
                      }}
                      value={result[scenario.test_cases[index].id]?.remarks}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Screenshots</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const fileLength = e.target.files.length;
                        for (let i = 0; i < fileLength; i++) {
                          e.target.files[i].imgRef = `imgRef${
                            params.id
                          }_${String(scenario.test_cases[index].id)}_${
                            account.id
                          }`;
                        }

                        setImages({
                          ...images,
                          [`imgRef${params.id}_${String(
                            scenario.test_cases[index].id
                          )}_${account.id}`]: e.target.files,
                        });
                      }}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default TesterSessionForm;
