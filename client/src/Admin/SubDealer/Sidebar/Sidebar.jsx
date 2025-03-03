/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Menu, Image } from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  FileTextOutlined,
  SyncOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const { Sider } = Layout;

export default function Sidebar({ collapsed, isMobile, onClose, siderWidth }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/subdealer/dashboard",
      icon: <DashboardOutlined style={{ fontSize: 24, color: "#6B7280" }} />,
      label: "Dashboard",
    },
    {
      key: "/subdealer/products",
      icon: <ShopOutlined style={{ fontSize: 24, color: "#6B7280" }} />,
      label: "Products",
    },
    // {
    //   key: "/subdealers",
    //   icon: <TeamOutlined style={{ fontSize: 24, color: "#6B7280" }} />,
    //   label: "Sub Dealers",
    // },
    {
      key: "/subdealer/sales",
      icon: <FileTextOutlined style={{ fontSize: 24, color: "#6B7280" }} />,
      label: "Sales",
    },
    {
      key: "/subdealer/replaced",
      icon: <SyncOutlined style={{ fontSize: 24, color: "#6B7280" }} />,
      label: "Replaced Products",
    },
    {
      key: "/subdealer/change/password",
      icon: <LockOutlined style={{ fontSize: 24, color: "#6B7280" }} />,
      label: "Change Password",
    },
    {
      key: "/logout",
      icon: <LogoutOutlined style={{ fontSize: 24, color: "#6B7280" }} />,
      label: "Log Out",
    },
  ];

  const sidebarStyle = {
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    padding: "16px",
  };

  const menuStyle = {
    backgroundColor: "transparent",
    fontSize: "18px",
    fontWeight: "600",
    border: "none",
  };

  const menuItemStyle = {
    padding: "12px 20px",
    marginBottom: "16px",
    borderRadius: "8px",
    height: "auto",
    lineHeight: "1.5",
    transition: "all 0.3s ease",
  };

  const handleMenuClick = (e) => {
    if (e.key === "/logout") {
      // Remove subdealer cookies
      Cookies.remove("subDealerToken");
      Cookies.remove("subdealerAuth");
      // Redirect to login page
      navigate("/subdealer/login");
    } else {
      navigate(e.key);
    }

    if (isMobile) {
      onClose?.();
    }
  };

  const sidebarContent = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ padding: "16px" }}
    >
      <Image
        src="/logo.jpg"
        alt="Yuvraj Industries Logo"
        preview={false}
        style={{
          marginBottom: 32,
          width: "90%",
          objectFit: "contain",
          transform: "scale(1.6)",
        }}
      />
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        style={menuStyle}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon} style={menuItemStyle}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </motion.div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {!collapsed && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 40,
              }}
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: siderWidth,
                backgroundColor: "#fff",
                zIndex: 50,
                boxShadow: "4px 0 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={siderWidth}
      style={{
        ...sidebarStyle,
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 999,
      }}
    >
      {sidebarContent}
    </Sider>
  );
}
