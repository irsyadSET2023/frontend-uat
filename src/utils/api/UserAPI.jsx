import { USER } from "./Axios";

export const getUserAccount = async () => {
  return await USER.get("/my-account", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const updateUserAccount = async (data) => {
  return await USER.put("/update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
