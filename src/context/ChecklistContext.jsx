import useGetChecklistApi from "@/utils/hooks/checklist/useGetChecklistApi";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useProjectContext } from "./ProjectContext";

const ChecklistContext = createContext(null);

const ChecklistProvider = ({ children }) => {
  const params = useParams();
  const location = useLocation();
  const checklistId = params["*"].split("/")[1];
  const initialized = useRef(false);
  const [pageInfo, setPageInfo] = useState(
    /(\/app\/projects)(\/\d*$)/.test(location.pathname)
      ? { page: 1, pageSize: 10 }
      : { page: null, pageSize: null }
  );
  const { projectId } = useProjectContext();
  const {
    data,
    handleGetChecklists: refetch,
    fetchChecklistState,
  } = useGetChecklistApi({
    page: pageInfo.page,
    pageSize: pageInfo.pageSize,
    projectId,
    initialized,
  });

  return (
    <ChecklistContext.Provider
      value={{
        checklistId,
        data,
        refetch,
        pageInfo,
        setPageInfo,
        initialized,
        fetchChecklistState,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklistContext = () => {
  const context = useContext(ChecklistContext);
  if (context === null) {
    throw new Error(
      "useChecklistContext must be used within a ChecklistProvider"
    );
  }
  return context;
};

export default ChecklistProvider;
