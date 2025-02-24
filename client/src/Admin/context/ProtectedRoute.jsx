/* eslint-disable react/prop-types */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ role = "admin" }) => {
  const location = useLocation();
  const authCookie =
    role === "admin" ? Cookies.get("adminAuth") : Cookies.get("dealerAuth");
  const redirectPath = role === "admin" ? "/admin/login" : "/dealer/login";
  const isAuthenticated = authCookie === "authenticated";

  console.log(`Checking ${role} authentication:`, {
    authCookie,
    isAuthenticated,
    currentPath: location.pathname,
  });

  if (!isAuthenticated) {
    console.log(`Redirecting to ${redirectPath} from ${location.pathname}`);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
