import useGetScenarioApi from "@/utils/hooks/scenario/useGetScenarioApi";
import { createContext, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjectContext } from "./ProjectContext";

const ScenarioContext = createContext(null);

const ScenarioProvider = ({ children }) => {
  const params = useParams();
  const { projectId } = useProjectContext();
  const checklistId = params["*"].split("/")[1];
  const scenarioId = params["*"].split("/")[2];

  const {
    data: scenarios,
    loadingState: scenarioLoading,
    handleGetScenario: refetchScenario,
  } = useGetScenarioApi({
    projectId,
    checklistId,
  });

  return (
    <ScenarioContext.Provider
      value={{ scenarios, scenarioLoading, refetchScenario, scenarioId }}
    >
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenarioContext = () => {
  const context = useContext(ScenarioContext);
  if (context === null) {
    throw new Error(
      "useScenarioContext must be used within a ScenarioProvider"
    );
  }
  return context;
};

export default ScenarioProvider;
