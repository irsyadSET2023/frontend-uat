import { useAuthContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const OwnerRoutes = () => {
  const { account } = useAuthContext();
  const isOwner = account.roles === "owner";
  if (isOwner) {
    return <Outlet />;
  } else {
    return <Navigate to="/app/projects" />;
  }
};

export default OwnerRoutes;
