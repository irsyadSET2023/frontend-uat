import React from "react";
import { Button } from "../ui/button";
import { Helmet } from "react-helmet-async";

const ErrorFallback = () => {
  return (
    <>
      <Helmet>
        <title>Oppss...</title>
      </Helmet>
      <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2>Oppss...</h2>
          <h3>Something wrong happened</h3>
        </div>

        <Button onClick={() => location.reload("/")}>Refresh app</Button>
      </div>
    </>
  );
};

export default ErrorFallback;
