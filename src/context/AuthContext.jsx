import { getTesterAccount } from "@/utils/api/TesterAPI";
import { getUserAccount } from "@/utils/api/UserAPI";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const cookie = new Cookies();

  const [account, setAccount] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [projectPermissions, setProjectPermissions] = useState([]);
  const [authLoading, setAuthLoading] = useState(false);
  const initialized = useRef(false);

  const getAccount = async () => {
    try {
      setAuthLoading(true);
      const token = cookie.get("token");
      const testerToken = cookie.get("testerToken");
      let res;
      if (token) {
        res = await getUserAccount();
      }
      if (testerToken) {
        res = await getTesterAccount();
      }
      if (res) {
        setAccount(res?.data?.data?.user || res?.data?.data || res?.data);
        setPermissions(res?.data?.data?.permissions);
        setProjectPermissions(res?.data?.data?.projectPermissions);
      }
      setAuthLoading(false);
    } catch (error) {
      cookie.remove("token", { path: "/" });
      cookie.remove("testerToken", { path: "/" });
      console.log(error);
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getAccount();
    }
  }, []);
  const values = {
    account,
    permissions,
    projectPermissions,
    authLoading,
    setAccount,
    getAccount,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
