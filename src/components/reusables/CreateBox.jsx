import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

const CreateBox = forwardRef(({ isShown = true, children, styling }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full h-[165px] flex justify-center items-center rounded-xl border border-[#E4E4E7] shadow-[0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)]"
    >
      <div
        className={cn(
          styling,
          isShown ? "display" : "hidden",
          "text-[12px] font-[400] text-[#131316]"
        )}
      >
        {children}
      </div>
    </div>
  );
});

export default CreateBox;
