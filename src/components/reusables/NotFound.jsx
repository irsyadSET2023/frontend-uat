import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
      <div className="flex flex-col justify-center items-center">
        <h2>404</h2>
        <h3>Content not found</h3>
      </div>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
