import { Monitor, Smartphone } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const ProjectCards = ({ data = [] }) => {
  const isShown = data.length > 0;

  return (
    isShown && (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 w-full">
        {data.map((item, index) => (
          <NavLink
            key={index}
            className="flex flex-col border border-[#E4E4E7] shadow-[0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)] p-[24px] rounded-xl hover:cursor-pointer"
            to={`/app/projects/${item.id}`}
          >
            <div className="flex justify-between items-center self-stretch pb-[8px] ">
              <p className="small text-primary">{item.projectType}</p>
              {item.projectType === "Web App" && (
                <Monitor color="#71717A" strokeWidth={1.25} />
              )}
              {item.projectType === "Mobile App" && (
                <Smartphone color="#71717A" strokeWidth={1.25} />
              )}
              {item.projectType === "Both" && (
                <div className="flex">
                  <Monitor color="#71717A" strokeWidth={1.25} />
                  <Smartphone color="#71717A" strokeWidth={1.25} />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-[700] leading-8">{item.name}</h3>
              <p className="text-muted-foreground text-[12px] leading-[16px]">
                {item.date}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default ProjectCards;
