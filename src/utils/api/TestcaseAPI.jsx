import { TESTCASE } from "./Axios";

export const getTestcases = async (projectId, scenarioId) => {
  return await TESTCASE.get(`/${scenarioId}?projectId=${projectId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const viewTestcase = async (projectId, scenarioId, testcaseId) => {
  return await TESTCASE.get(
    `/${scenarioId}/${testcaseId}?projectId=${projectId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const createTestcase = async (projectId, scenarioId, data) => {
  return await TESTCASE.post(`/${scenarioId}?projectId=${projectId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateTestcase = async (
  projectId,
  scenarioId,
  testcaseId,
  data
) => {
  return await TESTCASE.put(
    `/${scenarioId}/?projectId=${projectId}&testcase=${testcaseId}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const swapTestcase = async (projectId, scenarioId, data) => {
  return await TESTCASE.put(
    `/swap/${scenarioId}?projectId=${projectId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteTestcase = async (projectId, scenarioId, testcaseId) => {
  return await TESTCASE.delete(
    `/${scenarioId}/?projectId=${projectId}&testcase=${testcaseId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
