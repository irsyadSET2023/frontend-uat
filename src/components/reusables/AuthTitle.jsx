import React from "react";
import { Badge } from "@/components/ui/badge";

const AuthTitle = ({ title, subtitle, showBadge }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="flex flex-row items-center justify-center gap-[8px]">
        {title}
        {showBadge && <Badge>testers</Badge>}
      </h3>
      <p className="muted">{subtitle}</p>
    </div>
  );
};

export default AuthTitle;
