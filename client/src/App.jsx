/* eslint-disable no-unused-vars */
import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./Admin/DealerLogin/MainLayout/MainLayout";
import Dashboard from "./Admin/DealerLogin/Sidebar/Dashboard";
import ProductsPage from "./Admin/DealerLogin/Pages/ProductsPage";
import SalesPage from "./Admin/DealerLogin/Pages/SalesPage";
import ReplacedPage from "./Admin/DealerLogin/Pages/ReplacedPage";
import Login from "./Admin/DealerLogin/Login"; // Dealer login component
import Barcode from "./Admin/DealerLogin/Pages/BarCode/Barcode";
import ChangePassword from "./Admin/DealerLogin/ChangePassword";
import SubDealerTable from "./Admin/DealerLogin/SubDealer/SubDealerTable";
import DealerProducts from "./Admin/pages/SubDealerData/DealerProducts";
// Sub dealer imports (unchanged)
import MainLayout1 from "./Admin/SubDealer/MainLayout/MainLayout";
import Dashboard1 from "./Admin/SubDealer/Sidebar/Dashboard";
import ProductsPage1 from "./Admin/SubDealer/Pages/ProductsPage";
import SalesPage1 from "./Admin/SubDealer/Pages/SalesPage";
import ReplacedPage1 from "./Admin/SubDealer/Pages/ReplacedPage";
import Login1 from "./Admin/DealerLogin/SubDealer/SubDealerLogin";
import Barcode1 from "./Admin/SubDealer/Pages/BarCode/Barcode";
import ChangePassword1 from "./Admin/SubDealer/ChangePassword";
import SubDealerTable1 from "./Admin/SubDealer/SubDealer/SubDealerTable";
import DealerProducts1 from "./Admin/pages/SubDealerData/DealerProducts";
import ProtectedRoute from "./Admin/context/ProtectedRoute";
import AdminLogin from "./Admin/components/AdminLogin/AdminLogin";
import SubDealerProductsPage from "./Admin/SubDealer/Pages/ProductsPage";
import ForgotPassword from "./Admin/components/forget/ForgetPassword";
import UnauthenticatedRoute from "./Admin/context/UnauthenticateRoute";

// Lazy-loaded Admin Routes
const AdminLayout = React.lazy(() => import("./Admin/AdminLayout"));
const Dashboard2 = React.lazy(() => import("./Admin/pages/Dashboard"));
const Dealears = React.lazy(() => import("./Admin/pages/Dealers"));
const Category = React.lazy(() => import("./Admin/pages/Category"));
const Products = React.lazy(() => import("./Admin/pages/Products"));
const Sales = React.lazy(() => import("./Admin/pages/sales"));
const Replaced = React.lazy(() => import("./Admin/pages/Replaced"));
const Settings = React.lazy(() => import("./Admin/pages/Settings"));
const SubDealers = React.lazy(() =>
  import("./Admin/pages/SubDealerData/SubDealerModal")
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Unprotected Home Route */}
      <Route path="/" element={<div>Home</div>} />
      <Route path="/dealer">
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute role="dealer" />}>
          <Route index element={<Navigate to="/dealer/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="products"
            element={
              <MainLayout>
                <ProductsPage />
              </MainLayout>
            }
          />
          <Route
            path="sales"
            element={
              <MainLayout>
                <SalesPage />
              </MainLayout>
            }
          />
          <Route
            path="replaced"
            element={
              <MainLayout>
                <ReplacedPage />
              </MainLayout>
            }
          />
          <Route
            path="sale/barcode"
            element={
              <MainLayout>
                <Barcode />
              </MainLayout>
            }
          />
          <Route
            path="subdealers"
            element={
              <MainLayout>
                <SubDealerTable />
              </MainLayout>
            }
          />
          <Route
            path="change/password"
            element={
              <MainLayout>
                <ChangePassword />
              </MainLayout>
            }
          />
        </Route>
      </Route>
      {/* Dealer Routes End */}

      {/* Sub Dealer Routes (Unchanged) */}
      <Route path="/subdealer">
        <Route path="login" element={<Login1 />} />
        <Route element={<ProtectedRoute role="subdealer" />}>
          <Route
            index
            element={<Navigate to="/subdealer/dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={
              <MainLayout1>
                <Dashboard1 />
              </MainLayout1>
            }
          />
          <Route
            path="products"
            element={
              <MainLayout1>
                <SubDealerProductsPage />
              </MainLayout1>
            }
          />
          <Route
            path="sales"
            element={
              <MainLayout1>
                <SalesPage1 />
              </MainLayout1>
            }
          />
          <Route
            path="replaced"
            element={
              <MainLayout1>
                <ReplacedPage1 />
              </MainLayout1>
            }
          />
          <Route
            path="barcode"
            element={
              <MainLayout1>
                <Barcode1 />
              </MainLayout1>
            }
          />
          <Route
            path="subdealers/v1"
            element={
              <MainLayout1>
                <SubDealerTable1 />
              </MainLayout1>
            }
          />
          <Route
            path="change/password"
            element={
              <MainLayout1>
                <ChangePassword1 />
              </MainLayout1>
            }
          />
        </Route>
      </Route>

      {/* Admin Routes Start */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<UnauthenticatedRoute />}>
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard2 />} />
          <Route path="category" element={<Category />} />
          <Route path="products" element={<Products />} />
          <Route path="dealers" element={<Dealears />} />
          <Route path="sales" element={<Sales />} />
          <Route path="replaced" element={<Replaced />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      {/* Admin Routes End */}
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
