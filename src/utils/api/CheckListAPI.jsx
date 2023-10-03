import { CHECKLIST } from "./Axios";

export const createCheckList = async (projId, data) => {
  return await CHECKLIST.post(
    "",
    data,
    {
      params: {
        projectId: projId,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getCheckList = async ({ projId, page, perPage }) => {
  return await CHECKLIST.get(
    "",
    {
      params: {
        projectId: projId,
        page,
        perPage,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const viewCheckList = async (projId, checklistId) => {
  return await CHECKLIST.get(`/${checklistId}?projectId=${projId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateCheckList = async (projId, checklistId, data) => {
  return await CHECKLIST.put(`/${checklistId}?projectId=${projId}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteCheckList = async (projId, checklistId) => {
  return await CHECKLIST.delete(`/${checklistId}?projectId=${projId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
