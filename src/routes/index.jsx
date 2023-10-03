import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Members from "@/modules/member/Members";
import Login from "@/modules/login/Login";
import RegisterOwner from "@/modules/registration/owner/RegisterOwner";
import TokenVerification from "@/modules/registration/owner/TokenVerification";
import RegisterMember from "@/modules/registration/member/RegisterMember";
import RegisterOrganization from "@/modules/registration/organization/RegisterOrganization";
import ProjectRoutes from "./ProjectRoutes";
import Projects from "@/modules/project/Projects";
import LoginTester from "@/modules/login/LoginTester";
import RegisterTester from "@/modules/registration/tester/RegisterTester";
import TokenVerificationTester from "@/modules/registration/tester/TokenVerificationTester";
import NotFound from "@/components/reusables/NotFound";
import OwnerRoutes from "./OwnerRoutes";
import AuthRoutes from "./AuthRoutes";
import TesterDashboard from "@/modules/tester/TesterDashboard";
import TesterSessionForm from "@/modules/session/TesterSessionForm";
import useJoinQrTesterSessionApi from "@/utils/hooks/tester/useJoinQrTesterSessionApi";
import Cookies from "universal-cookie";
import { useEffect, useRef } from "react";
import TesterAuthRoutes from "./TesterAuthRoutes";
import { useToast } from "@/components/ui/use-toast";
import PasswordReset from "@/modules/login/PasswordReset";

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/">
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="login/reset" element={<PasswordReset />} />
          <Route path="register" element={<Outlet />}>
            <Route index element={<RegistrationRoutes />} />
            <Route path="verify" element={<TokenVerification />} />
            <Route path="organization" element={<RegisterOrganization />} />
          </Route>

          <Route path="app" element={<AuthRoutes />}>
            <Route index element={<Projects />} />
            <Route path="members" element={<OwnerRoutes />}>
              <Route index element={<Members />} />
            </Route>
            <Route path="projects/*" element={<ProjectRoutes />} />
          </Route>

          <Route path="tester">
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<LoginTester />} />
            <Route path="register" element={<Outlet />}>
              <Route index element={<RegisterTester />} />
              <Route path="verify" element={<TokenVerificationTester />} />
            </Route>
            <Route path="session" element={<TesterAuthRoutes />}>
              <Route index element={<TesterDashboard />} />
              <Route path=":id" element={<TesterSessionForm />} />
            </Route>
            <Route path="join/:id" element={<QrRedirectRoutes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const RegistrationRoutes = () => {
  let [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  return token ? <RegisterMember /> : <RegisterOwner />;
};

const QrRedirectRoutes = () => {
  const cookie = new Cookies();
  const params = useParams();
  const { data } = useJoinQrTesterSessionApi({
    sessionUniqueId: params.id,
  });
  const testerToken = cookie.get("testerToken");
  const navigate = useNavigate();
  const initialized = useRef(false);
  const location = useLocation();
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: "Login required",
      description: "Please log in to join the session.",
      duration: 3000,
      status: "error",
    });
  };

  useEffect(() => {
    if (data.sessionId && !initialized.current) {
      initialized.current = true;
      navigate(`/tester/session/${data.sessionId}`);
    }
  }, [data.sessionId, initialized.current]);

  if (testerToken) {
    return null;
  } else {
    showToast();

    return <Navigate to="/tester/login" state={{ from: location }} />;
  }
};

export default AppRoutes;
