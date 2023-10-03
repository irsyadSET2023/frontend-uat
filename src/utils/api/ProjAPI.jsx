import { PROJ } from "./Axios";

export const createProject = async (data) => {
  return await PROJ.post("/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProject = async () => {
  return await PROJ.get("/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const viewProject = async (projId) => {
  return await PROJ.get(`/${projId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateProject = async (projId, data) => {
  return await PROJ.put(`/update/${projId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProject = async (projId) => {
  return await PROJ.delete(`/${projId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateAdminProjects = async (userId, data) => {
  return await PROJ.put(`/assign/${userId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateAdminPermissions = async (projId, data) => {
  return await PROJ.put(`/admin/${projId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
