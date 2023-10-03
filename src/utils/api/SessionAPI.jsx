import { SESSION } from "./Axios";

export const createSession = async (data) => {
  return await SESSION.post("/", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getSession = async (projectId, data) => {
  return await SESSION.get(`/project/${projectId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateSession = async (sessionId, data) => {
  return await SESSION.put(`/${sessionId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const viewSession = async (sessionId, data) => {
  return await SESSION.get(`/${sessionId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteSession = async (sessionId, data) => {
  return await SESSION.delete(`/${sessionId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const startSession = async (sessionId, data) => {
  return await SESSION.get(`/${sessionId}/start`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getSessionResult = async (sessionId) => {
  return await SESSION.get(`/result/${sessionId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const viewSessionTestcaseResult = async (sessionId, testcaseId) => {
  return await SESSION.get(`/result/${sessionId}/${testcaseId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
