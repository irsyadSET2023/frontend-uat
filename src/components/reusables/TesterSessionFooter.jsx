import React from "react";
import { Button } from "../ui/button";

const TesterSessionFooter = ({
  submitHandler = () => {},
  completedTestcase = 0,
  totalTestcase = 0,
  buttonLabel,
}) => {
  return (
    <>
      <div className="py-6 px-8 bg-black fixed bottom-0 w-full flex justify-between items-center">
        <div>
          <h4 className="text-white">
            Case tested ({completedTestcase} / {totalTestcase})
          </h4>
        </div>

        <Button
          disabled={completedTestcase === totalTestcase ? false : true}
          variant="outline"
          onClick={submitHandler}
        >
          {buttonLabel}
        </Button>
      </div>
    </>
  );
};

export default TesterSessionFooter;
