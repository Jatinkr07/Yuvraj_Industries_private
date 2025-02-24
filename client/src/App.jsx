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
import Login1 from "./Admin/SubDealer/Login";
import Barcode1 from "./Admin/SubDealer/Pages/BarCode/Barcode";
import ChangePassword1 from "./Admin/SubDealer/ChangePassword";
import SubDealerTable1 from "./Admin/SubDealer/SubDealer/SubDealerTable";
import DealerProducts1 from "./Admin/pages/SubDealerData/DealerProducts";
import ProtectedRoute from "./Admin/context/ProtectedRoute";
import AdminLogin from "./Admin/components/AdminLogin/AdminLogin";

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

      {/* Dealer Routes Start */}
      <Route path="/dealer">
        {/* Unprotected Login Route */}
        <Route path="login" element={<Login />} />
        {/* Protected Routes */}
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
      <Route path="/subdealer/login" element={<Login1 />} />
      <Route
        path="/subdealer"
        element={
          <MainLayout1>
            <Dashboard1 />
          </MainLayout1>
        }
      />
      <Route
        path="subdealer/dashboard"
        element={
          <MainLayout1>
            <Dashboard1 />
          </MainLayout1>
        }
      />
      <Route
        path="/subdealer/products"
        element={
          <MainLayout1>
            <ProductsPage1 />
          </MainLayout1>
        }
      />
      <Route
        path="subdealer/sales"
        element={
          <MainLayout1>
            <SalesPage1 />
          </MainLayout1>
        }
      />
      <Route
        path="subdealer/replaced"
        element={
          <MainLayout1>
            <ReplacedPage1 />
          </MainLayout1>
        }
      />
      <Route
        path="/subdealer/barcode"
        element={
          <MainLayout1>
            <Barcode1 />
          </MainLayout1>
        }
      />
      <Route
        path="/subdealers/v1"
        element={
          <MainLayout1>
            <SubDealerTable1 />
          </MainLayout1>
        }
      />
      <Route path="/subdealer/change/password" element={<ChangePassword1 />} />

      {/* Admin Routes Start */}
      <Route path="/admin/login" element={<AdminLogin />} />
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
