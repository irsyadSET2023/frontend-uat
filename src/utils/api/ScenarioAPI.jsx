import { SCENARIO } from "./Axios";

export const createScenario = async (projectId, checklistId, data) => {
  return await SCENARIO.post(
    `/${checklistId}`,
    data,
    {
      params: {
        projectId,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getScenario = async (projectId, checklistId) => {
  return await SCENARIO.get(
    `/${checklistId}`,
    {
      params: {
        projectId,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const viewScenario = async (projectId, checklistId, scenarioId) => {
  return await SCENARIO.get(
    `/${checklistId}/${scenarioId}`,
    {
      params: {
        projectId,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const updateScenario = async (
  projectId,
  checklistId,
  scenario,
  data
) => {
  return await SCENARIO.put(
    `/${checklistId}`,
    data,
    {
      params: {
        projectId,
        scenario,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const swapScenario = async (projectId, checklistId, data) => {
  return await SCENARIO.put(
    `/swap/${checklistId}?projectId=${projectId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteScenario = async (projectId, checklistId, scenario) => {
  return await SCENARIO.delete(
    `/${checklistId}`,
    {
      params: {
        projectId,
        scenario,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
