import useGetProjectApi from "@/utils/hooks/project/useGetProjectApi";
import { createContext, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";

const ProjectContext = createContext(null);

const ProjectProvider = ({ children }) => {
  const params = useParams();

  const projectId = params["*"]?.split("/")[0] || null;
  const validParams = params["*"].split("/").length === 1;

  const navigate = useNavigate();
  const {
    data: projects,
    loadingState: projectState,
    handleGetAllProject: refetchProjects,
  } = useGetProjectApi({
    onSuccess: (resData) => {
      if (validParams) {
        if (projectId) {
          navigate(`/app/projects/${projectId}`, { replace: true });
        } else {
          navigate(`/app/projects/${String(resData[0]?.id || "")}`, {
            replace: true,
          });
        }
      }
    },
    onError: () => {
      navigate(`/app/projects`);
    },
  });

  const selectedProject = projects?.find(
    (item) => item.id === parseInt(projectId)
  );

  const values = {
    projects,
    projectState,
    refetchProjects,
    projectId,
  };

  return (
    <ProjectContext.Provider value={values}>
      <>
        <Helmet>
          <title>Nextest ({selectedProject?.name || "Projects"})</title>
        </Helmet>
        {children}
      </>
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);
export default ProjectProvider;
