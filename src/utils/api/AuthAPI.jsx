import { AUTH } from "./Axios";

export const registerUser = async (data) => {
  return await AUTH.post("/register", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const loginUser = async (data) => {
  return await AUTH.post("/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const requestResetPassword = async (data) => {
  return await AUTH.post("/password", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const resetPassword = async (data) => {
  console.log(data);
  return await AUTH.put("/password", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const inviteAdmin = async (data) => {
  return await AUTH.post("/invite", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const verifyOwner = async (data) => {
  return await AUTH.post("/verify", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const registerMember = async (data, token) => {
  return await AUTH.put(
    `/register?token=${token}&email=${data.email}`,
    {
      username: data.username,
      password: data.password,
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const checkToken = async (token) => {
  return await AUTH.get(`/check/${token}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
