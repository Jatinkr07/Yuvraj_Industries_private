import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const UnauthenticatedRoute = () => {
  const authCookie = Cookies.get("adminAuth");
  const isAuthenticated = authCookie === "authenticated";

  console.log("UnauthenticatedRoute check:", {
    authCookie,
    isAuthenticated,
    currentPath: window.location.pathname,
  });

  if (isAuthenticated) {
    console.log("Redirecting authenticated user to /admin/dashboard");
    return <Navigate to="/admin/dashboard" replace />;
  }

  console.log("Allowing access to unauthenticated route");
  return <Outlet />;
};

export default UnauthenticatedRoute;
