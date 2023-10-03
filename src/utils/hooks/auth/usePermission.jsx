import { useAuthContext } from "@/context/AuthContext";
import { useProjectContext } from "@/context/ProjectContext";
import { useEffect, useState } from "react";

const useProjectPermission = () => {
  const { projectId } = useProjectContext();
  const { projectPermissions } = useAuthContext();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const p = projectPermissions.find(
      (p) => p.projectId === parseInt(projectId)
    );

    if (p?.permissions === "canEdit") {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }
  }, [projectId, projectPermissions]);

  return canEdit;
};

export default useProjectPermission;
