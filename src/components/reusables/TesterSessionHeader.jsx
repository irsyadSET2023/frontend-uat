import React from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

const TesterSessionHeader = ({ title = "No title found" }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full bg-[#18181B] py-2 text-center">
        <h4 className="text-white">nextest</h4>
      </div>

      <div className="py-6 px-8 border-b flex justify-between items-center">
        <h3>{`${title}`}</h3>
        <Button
          variant="outline"
          className="px-2"
          onClick={() => navigate("/tester/session")}
        >
          <X size={24} />
        </Button>
      </div>
    </>
  );
};

export default TesterSessionHeader;
