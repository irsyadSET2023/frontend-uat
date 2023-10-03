import { ORG } from "./Axios";

export const registerOrganization = async (data) => {
  return await ORG.post("/", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getOrganizationMember = async (isVerified, page, pageSize) => {
  return await ORG.get(
    `/member?verified=${isVerified}`,
    {
      params: {
        page,
        perPage: pageSize,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
