import LeadText from "@/components/reusables/LeadText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ClipboardCheck, ClipboardCopy } from "lucide-react";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import useStartSessionApi from "@/utils/hooks/session/useStartSessionApi";
import { Button } from "@/components/ui/button";
import { useProjectContext } from "@/context/ProjectContext";

const SessionQr = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const { projectId } = useProjectContext();
  const { data: startData } = useStartSessionApi({
    sessionId: params.sessionId,
  });

  const copyTextToClipboard = () => {
    const textToCopy = document.getElementById("link");
    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy.innerText)
        .then(() => {
          setIsCopied(true);
          {
            toast({
              description: "URL copied to clipboard!",
              duration: 2000,
            });
          }

          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Copy to clipboard failed:", error);
        });
    }
  };

  return (
    <div className="flex flex-row items-center w-screen h-screen">
      <div className="bg-[#18181B] text-white w-[50%] h-full p-[40px] gap-[16px] flex flex-col justify-center">
        <Button
          variant="secondary"
          onClick={() => navigate(`/app/projects/${projectId}/sessions`)}
          className="w-fit fixed top-8 left-8"
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <div className="flex items-center ">
          <h3 className="border-r pr-[16px] leading-8">nextest</h3>
          <p className="pl-[16px] large font-[500] leading-7">
            {startData?.organizationName}
          </p>
        </div>
        <div className="space-y-[16px]">
          <div className="flex items-center gap-[16px]">
            <Avatar>
              <AvatarImage src={startData?.projectIconUrl} />
              <AvatarFallback>
                {startData?.organizationName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-[8px]">
              <h3>{startData?.projectName}</h3>
              <Badge className="h-fit" variant="secondary">
                {startData?.projectType === "Web App"
                  ? "Web"
                  : startData?.projectType === "Mobile App"
                  ? "Mobile"
                  : startData?.projectType === "Both"
                  ? "Both"
                  : null}
              </Badge>
            </div>
          </div>
          <h1 className="tracking-[-0.9px]">{startData?.checklistName}</h1>
        </div>
      </div>
      <div className="w-[50%] flex flex-col items-center justify-center gap-[24px]">
        <div
          style={{
            height: 404,
            margin: "0 auto",
            width: 372,
            maxWidth: "100%",
          }}
        >
          <QRCode
            size={404}
            style={{ height: "100%", maxWidth: "100%", width: "100%" }}
            value={startData?.url || ""}
            viewBox={`0 0 372 404`}
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-[16px] w-full">
          <h3>Scan to join</h3>
          <div className="w-1/2">
            <LeadText>OR VISIT</LeadText>
          </div>
          <div className="flex items-center gap-2">
            <h3 id="link">{startData?.url?.replace("https://", "")}</h3>
            {isCopied ? (
              <ClipboardCheck
                size={22}
                color="#04ff00"
                strokeWidth={1}
                absoluteStrokeWidth
              />
            ) : (
              <ClipboardCopy
                className="hover:cursor-pointer "
                size={22}
                strokeWidth={1}
                absoluteStrokeWidth
                onClick={copyTextToClipboard}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionQr;
