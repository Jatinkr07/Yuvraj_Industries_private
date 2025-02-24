/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const { Header } = Layout;

const getDeviceSiderWidth = () => {
  if (window.innerWidth >= 1440) return 300;
  if (window.innerWidth >= 1024) return 250;
  if (window.innerWidth >= 768) return 200;
  return 280;
};

const getPageTitle = (pathname) => {
  const titles = {
    "/dealer/dashboard": "Dashboard",
    "/dealer/products": "Products",
    "/dealer/sales": "Sales",
    "/dealer/replaced": "Replaced Products",
    "/dealer/subdealers": "Sub Dealers",
    "/dealer/sale/barcode": "Add Sale",
    "/dealer/change/password": "Change Password",
  };
  return titles[pathname] || "Dashboard";
};

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [siderWidth, setSiderWidth] = useState(getDeviceSiderWidth());
  const location = useLocation();
  const currentPage = getPageTitle(location.pathname);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSiderWidth(getDeviceSiderWidth());
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const headerStyle = {
    backgroundColor: "#7CB9E8",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "32px",
    position: "sticky",
    top: 0,
    zIndex: 30,
    height: "64px",
    lineHeight: "32px",
  };

  const layoutStyle = {
    marginLeft: isMobile ? 0 : collapsed ? 80 : siderWidth,
    transition: "margin-left 0.3s",
    minHeight: "100vh",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={isMobile ? !isMobileMenuOpen : collapsed}
        isMobile={isMobile}
        onClose={() => setIsMobileMenuOpen(false)}
        siderWidth={siderWidth}
      />
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ padding: 0 }}
            />
          ) : (
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ color: "#fff", fontSize: 20 }} />
                ) : (
                  <MenuFoldOutlined style={{ color: "#fff", fontSize: 20 }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{ padding: 0 }}
            />
          )}
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 600,
                margin: 0,
                lineHeight: "32px",
              }}
            >
              {currentPage}
            </h1>
          </motion.div>
        </Header>
        {children}
      </Layout>
    </Layout>
  );
}
