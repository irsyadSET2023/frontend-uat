import React from "react";
import Wysiwyg from "./Wysiwyg";

const TesterTestcaseDetails = ({ testcase }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="font-medium">Description</p>
        <p>{testcase.description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-medium">Step Details</p>
        <Wysiwyg
          readOnly
          value={testcase.stepDetails}
          className="bg-transparent border-none !p-0"
          editableclassname="border-t-0 min-h-fit p-0"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-medium">Expected Results</p>
        <Wysiwyg
          readOnly
          value={testcase.expectedResults}
          className="bg-transparent border-none !p-0"
          editableclassname="border-t-0 min-h-fit p-0"
        />
      </div>
    </>
  );
};

export default TesterTestcaseDetails;
