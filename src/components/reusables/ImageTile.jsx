import { cn } from "@/lib/utils";
import { Eye, X } from "lucide-react";
import React, { useState } from "react";

const ImageTile = ({ onDelete = null, ...props }) => {
  const [isFullScreen, setFullScreen] = useState(false);
  const handleFullScreen = () => {
    setFullScreen(!isFullScreen);
  };

  window.addEventListener("keydown", (e) => {});
  return (
    <>
      {isFullScreen && (
        <div className="z-50 bg-primary/50 flex justify-center items-center fixed top-0 left-0 w-screen h-screen">
          <button
            type="button"
            className="absolute top-4 right-4 cursor-pointer p-1 border border-white/50 rounded transition-all delay-300"
            onClick={handleFullScreen}
          >
            <X size={24} color="white" />
          </button>

          <div
            style={{
              width: "90vw",
              height: "90vh",
              backgroundImage: `url(${props.src})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
      <div className="relative group w-fit h-fit">
        {onDelete && (
          <button
            type="button"
            className="absolute top-2 right-2 cursor-pointer p-1 border border-white/50 rounded opacity-0 group-hover:opacity-100 transition-all delay-300"
            onClick={() => onDelete()}
          >
            <X size={16} color="white" />
          </button>
        )}
        <button
          type="button"
          onClick={handleFullScreen}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-primary -translate-y-1/2 cursor-pointer p-2 rounded opacity-0 group-hover:opacity-100 transition-all"
        >
          <Eye size={16} color="white" />
        </button>
        <img
          {...props}
          className={cn(
            "h-[150px] w-[150px] object-cover object-center",
            props.className
          )}
        />
      </div>
    </>
  );
};

export default ImageTile;
