import SelectedProject from "@/modules/project/SelectedProject";
import { Route, Routes } from "react-router-dom";
import ProjectSettings from "@/modules/project/settings/ProjectSettings";
import AdminSettings from "@/modules/project/settings/AdminSettings";
import Checklists from "@/modules/checklist/Checklists";
import Scenarios from "@/modules/scenario/Scenarios";
import OwnerRoutes from "./OwnerRoutes";
import ProjectProvider from "@/context/ProjectContext";
import Sessions from "@/modules/session/Sessions";
import ChecklistProvider from "@/context/ChecklistContext";
import ScenarioProvider from "@/context/ScenarioContext";
import SessionQr from "@/modules/session/SessionQr";
import ResultChecklist from "@/modules/session/ResultChecklist";
import ResultTestcase from "@/modules/session/ResultTestcase";

const ProjectRoutes = () => {
  return (
    <ProjectProvider>
      <ChecklistProvider>
        <ScenarioProvider>
          <Routes>
            <Route index element={<SelectedProject disabled={true} />} />
            <Route path=":id" element={<SelectedProject />} />
            <Route path=":id/sessions" element={<Sessions />} />
            <Route path=":id/sessions/:sessionId" element={<SessionQr />} />
            <Route
              path=":id/sessions/result/:sessionId"
              element={<ResultChecklist />}
            />
            <Route
              path=":id/sessions/result/:sessionId/:testcaseId"
              element={<ResultTestcase />}
            />
            <Route path=":id/settings" element={<OwnerRoutes />}>
              <Route index element={<ProjectSettings />} />
              <Route path="admin" element={<AdminSettings />} />
            </Route>
            <Route path=":id/:checklistId" element={<Checklists />} />
            <Route
              path=":id/:checklistId/:scenarioId"
              element={<Scenarios />}
            />
          </Routes>
        </ScenarioProvider>
      </ChecklistProvider>
    </ProjectProvider>
  );
};

export default ProjectRoutes;
