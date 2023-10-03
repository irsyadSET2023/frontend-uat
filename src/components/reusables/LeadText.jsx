import React from "react";

const LeadText = ({ children }) => {
  return (
    <div className="w-full h-[0.85rem] border-b border-b-border text-center mb-3">
      <span className="lead text-xs px-3 bg-white">{children}</span>
    </div>
  );
};

export default LeadText;
