import { TESTER } from "./Axios";

export const loginTester = async (data) => {
  return await TESTER.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const registerTester = async (data) => {
  return await TESTER.post("/auth", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const verifyTester = async (data) => {
  return await TESTER.post("/auth/verify", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const startSession = async (sessionId) => {
  return await TESTER.get(`/${sessionId}/start`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getTesterSession = async (data) => {
  return await TESTER.get("/user", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const joinTesterSession = async (data) => {
  return await TESTER.post("/session", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteTesterSession = async (sessionId, data) => {
  return await TESTER.delete(`/${sessionId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getTesterAccount = async () => {
  return await TESTER.get("/auth/my-account", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getStartTesterSession = async (sessionId) => {
  return await TESTER.get(`/${sessionId}/start`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const submitTesterSession = async (sessionId, data) => {
  return await TESTER.post(`${sessionId}/submit`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateTesterSession = async (sessionId, data) => {
  return await TESTER.put(`${sessionId}/submit`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getTesterSessionResult = async (sessionId) => {
  return await TESTER.get(`/${sessionId}/result`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const joinQrTesterSession = async (sessionUniqueId) => {
  return await TESTER.post(`/${sessionUniqueId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
