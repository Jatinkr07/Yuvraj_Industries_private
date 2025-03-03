/* eslint-disable react/prop-types */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ role = "admin" }) => {
  const location = useLocation();

  const authConfig = {
    admin: {
      cookie: "adminAuth",
      redirect: "/admin/login",
    },
    dealer: {
      cookie: "dealerAuth",
      redirect: "/dealer/login",
    },
    subdealer: {
      cookie: "subDealerToken",
      redirect: "/subdealer/login",
    },
  };

  const currentAuth = authConfig[role];
  const authCookie = Cookies.get(currentAuth.cookie);
  const isAuthenticated =
    role === "subdealer" ? !!authCookie : authCookie === "authenticated";

  console.log(`Checking ${role} authentication:`, {
    authCookie,
    isAuthenticated,
    currentPath: location.pathname,
  });

  if (!isAuthenticated) {
    console.log(
      `Redirecting to ${currentAuth.redirect} from ${location.pathname}`
    );
    return (
      <Navigate to={currentAuth.redirect} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
