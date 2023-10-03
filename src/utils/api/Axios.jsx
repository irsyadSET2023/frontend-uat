import axios from "axios";
import { Navigate } from "react-router";
import Cookies from "universal-cookie";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = BASE_URL + "/api";
const AUTH_URL = API_URL + "/auth";
const USER_URL = API_URL + "/user";
const ORG_URL = API_URL + "/organization";
const TESTER_URL = API_URL + "/tester";
const PROJ_URL = API_URL + "/project";
const CL_URL = API_URL + "/checklist";
const SCENARIO_URL = API_URL + "/scenario";
const SESSION_URL = API_URL + "/session";
const TESTCASE_URL = API_URL + "/testcase";
const cookie = new Cookies();

export const API = axios.create({
  baseURL: API_URL,
});

export const AUTH = axios.create({
  baseURL: AUTH_URL,
});

export const USER = axios.create({
  baseURL: USER_URL,
});

export const ORG = axios.create({
  baseURL: ORG_URL,
});

export const TESTER = axios.create({
  baseURL: TESTER_URL,
});

export const PROJ = axios.create({
  baseURL: PROJ_URL,
});

export const SESSION = axios.create({
  baseURL: SESSION_URL,
});

export const CHECKLIST = axios.create({
  baseURL: CL_URL,
});

export const SCENARIO = axios.create({
  baseURL: SCENARIO_URL,
});

export const TESTCASE = axios.create({
  baseURL: TESTCASE_URL,
});

const authInterceptor = (req) => {
  const token = cookie.get("token");
  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }
  const testerToken = cookie.get("testerToken");
  if (testerToken) {
    req.headers["Authorization"] = `Bearer ${testerToken}`;
  }

  return req;
};

const authTokenInterceptor = (res) => {
  const token = res?.data?.jwt || res?.data?.data?.jwt;

  const testerToken = res?.data?.testerJwt || res?.data?.data?.testerJwt;
  if (token) {
    cookie.set("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 * 4 });
    cookie.remove("testerToken", { path: "/" });
  }
  if (testerToken) {
    cookie.set("testerToken", testerToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 4,
    });
    cookie.remove("token", { path: "/" });
  }

  return res;
};

const responseInterceptor = (res) => {
  return res;
};

const errorInterceptor = (err) => {
  switch (err?.response?.status) {
    case 401:
      if (cookie.get("token")) {
        cookie.remove("token", { path: "/" });
      }
      if (cookie.get("testerToken")) {
        cookie.remove("testerToken", { path: "/" });
      }
      return Promise.reject(err);
    case 403:
      if (cookie.get("token")) {
        cookie.remove("token", { path: "/" });
      }
      if (cookie.get("testerToken")) {
        cookie.remove("testerToken", { path: "/" });
      }
      return Promise.reject(err);
    default:
      return Promise.reject(err);
  }
};

AUTH.interceptors.request.use(authInterceptor);
AUTH.interceptors.response.use(authTokenInterceptor, errorInterceptor);

TESTER.interceptors.request.use(authInterceptor);
TESTER.interceptors.response.use(authTokenInterceptor, errorInterceptor);

const PROTECTED_API = [USER, ORG, PROJ, CHECKLIST, SCENARIO, SESSION, TESTCASE];
PROTECTED_API.forEach((api) => {
  api.interceptors.request.use(authInterceptor);
  api.interceptors.response.use(responseInterceptor, errorInterceptor);
});
