import AuthTitle from "@/components/reusables/AuthTitle";
import { useAuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const TesterAuthRoutes = () => {
  const location = useLocation();
  const { account, authLoading } = useAuthContext();

  if (!authLoading) {
    if (!account?.id) {
      return <Navigate to="/tester/login" state={{ from: location }} />;
    } else {
      return <Outlet />;
    }
  } else {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <AuthTitle title={"nextest"} subtitle={"Loading..."} />
        <Loader2 size={48} className="animate-spin mt-8" />
      </div>
    );
  }
};

export default TesterAuthRoutes;
