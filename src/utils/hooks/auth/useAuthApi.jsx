import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  loginUser,
  registerMember,
  registerUser,
  requestResetPassword,
  resetPassword,
  verifyOwner,
} from "../../api/AuthAPI";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "universal-cookie";
import {
  loginTester,
  registerTester,
  verifyTester,
} from "@/utils/api/TesterAPI";

const useAuthApi = ({ form }) => {
  const [loadingState, setLoadingState] = useState("pending");
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { getAccount, authLoading } = useAuthContext();
  const cookie = new Cookies();

  const handleRegister = async (formData) => {
    try {
      setLoadingState("loading");
      await registerUser(formData);
      setLoadingState("success");
      if (location.pathname === "/register") {
        navigate("/register/verify/?email=" + form.getValues("email"));
      }
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Registration unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const registerError = error?.response?.data?.errors?.errors || [];
      registerError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
    } finally {
      setLoadingState("pending");
    }
  };

  const handleRegisterMember = async (formData, token) => {
    try {
      setLoadingState("loading");
      await registerMember(formData, token);
      setLoadingState("success");
      await getAccount();
      if (!authLoading) {
        navigate("/app");
      }
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Registration unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const registerError = error?.response?.data?.errors?.errors || [];
      registerError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
    } finally {
      setLoadingState("pending");
    }
  };

  const handleLogin = async (formData) => {
    try {
      setLoadingState("loading");
      await loginUser(formData);
      setLoadingState("success");
      await getAccount();
      if (!authLoading) {
        navigate(location?.state?.from?.pathname || "/app");
      }
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Log in unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const loginError =
        error?.response?.data?.errors?.errors ||
        error?.response?.data ||
        "An unexpected error occured";
      if (
        error?.response?.status === 400 &&
        loginError.message === "User is not verified"
      ) {
        navigate("/register/verify/?email=" + formData.email);
      }

      if (Array.isArray(loginError)) {
        loginError.map((err) => {
          form.setError(err.path, {
            message: err.msg,
          });
        });
      } else {
        form.setError("email", {
          message: loginError.message || loginError.Error,
        });
        form.setError("password", {
          message: loginError.message || loginError.Error,
        });
      }
    } finally {
      setLoadingState("pending");
    }
  };

  const handleVerifyOwner = async (formData) => {
    try {
      setLoadingState("loading");
      const res = await verifyOwner(formData);
      setLoadingState("success");
    } catch (error) {
      setLoadingState("error");
      const verifyError = error?.response?.data?.errors?.errors[0]?.msg;
      form.setError("token", {
        message: verifyError,
      });
    }
  };

  const handleLogout = async () => {
    cookie.remove("token", { path: "/" });
    navigate("/login");
  };

  const handleLogoutTester = async () => {
    cookie.remove("testerToken", { path: "/" });
    navigate("/tester");
  };

  const handleRegisterTester = async (formData) => {
    try {
      setLoadingState("loading");
      await registerTester(formData);
      setLoadingState("success");
      if (location.pathname === "/tester/register") {
        navigate("./verify/?email=" + form.getValues("email"));
      }
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Registration unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const registerError = error?.response?.data?.errors?.errors || [];
      registerError.map((err) => {
        form.setError(err.path, {
          message: err.msg,
        });
      });
    } finally {
      setLoadingState("pending");
    }
  };

  const handleLoginTester = async (formData) => {
    try {
      setLoadingState("loading");
      await loginTester(formData);
      setLoadingState("success");
      await getAccount();
      if (!authLoading) {
        navigate(location?.state?.from?.pathname || "/tester/session");
      }
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Error",
        description: "Log in unsuccessful. Please try again.",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
      const loginError =
        error?.response?.data?.errors?.errors ||
        error?.response?.data ||
        "An unexpected error occured";
      if (
        error?.response?.status === 400 &&
        loginError.message === "User is not verified"
      ) {
        navigate("/tester/register/verify/?email=" + formData.email);
      }

      if (Array.isArray(loginError)) {
        loginError.map((err) => {
          form.setError(err.path, {
            message: err.msg,
          });
        });
      } else {
        form.setError("email", {
          message: loginError.message || loginError.Error,
        });
        form.setError("password", {
          message: loginError.message || loginError.Error,
        });
      }
    } finally {
      setLoadingState("pending");
    }
  };

  const handleVerifyTester = async (formData) => {
    try {
      setLoadingState("loading");
      const res = await verifyTester(formData);
      setLoadingState("success");
    } catch (error) {
      setLoadingState("error");
      const verifyError = error?.response?.data?.errors?.errors[0]?.msg;
      form.setError("token", {
        message: verifyError,
      });
    }
  };

  const handleRequestResetPassword = async (formData) => {
    try {
      setLoadingState("loading");
      const res = await requestResetPassword(formData);
      setLoadingState("success");
      toast({
        title: "Password reset",
        description: `A password reset link has been sent to ${formData.email}`,
        duration: 4000,
      });
      form.reset({ email: "" });
    } catch (error) {
      setLoadingState("error");
      const err =
        error?.response?.data?.errors?.errors[0] ||
        error?.response?.data ||
        "An unexpected error occured";
      form.setError(err.path, {
        message: err.msg,
      });
    }
  };

  const handleResetPassword = async (formData) => {
    console.log(formData);
    try {
      setLoadingState("loading");
      const res = await resetPassword(formData);
      setLoadingState("success");
      toast({
        title: "Password reset",
        description: `Your password has been reset successfuly. Please proceed to login with your new password.`,
        duration: 4000,
      });
      form.reset();
      navigate("/login");
    } catch (error) {
      setLoadingState("error");
      toast({
        title: "Reset unsuccessful",
        description:
          "An error occured while resetting your password. Please try again or contact us",
        duration: 3000,
        status: "error",
        variant: "destructive",
      });
    }
  };

  return {
    loadingState,
    handleRegister,
    handleRegisterMember,
    handleLogin,
    handleVerifyOwner,
    handleLogout,
    handleLoginTester,
    handleRegisterTester,
    handleVerifyTester,
    handleLogoutTester,
    handleRequestResetPassword,
    handleResetPassword,
  };
};

export default useAuthApi;
