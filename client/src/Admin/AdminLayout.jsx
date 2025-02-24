import { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, ConfigProvider } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TbCategoryFilled } from "react-icons/tb";
import { BsFileBarGraphFill } from "react-icons/bs";
import { HiTemplate } from "react-icons/hi";
import { FaUsersGear } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { BiSolidChart } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../Services/api";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentKey, setCurrentKey] = useState("1");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/admin/logout`);
      Cookies.remove("adminAuth", {
        path: "/",
        secure: true,
        sameSite: "strict",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleNavigate = (e) => {
    const itemTo = sideBarItems.find((item) => item.key == e.key).to;
    return navigate(itemTo);
  };
  const sideBarItems = [
    {
      key: "1",
      label: "Dashboard",
      to: "dashboard",
      icon: <TbCategoryFilled />,
    },
    {
      key: "2",
      label: "Category",
      to: "category",
      icon: <BsFileBarGraphFill />,
    },
    { key: "3", label: "Products", to: "products", icon: <HiTemplate /> },
    { key: "4", label: "Dealers", to: "dealers", icon: <FaUsersGear /> },
    { key: "5", label: "Sales", to: "sales", icon: <FaCalendarAlt /> },
    { key: "6", label: "Replaced", to: "replaced", icon: <BiSolidChart /> },
    {
      key: "7",
      label: "Change Password",
      to: "settings",
      icon: <IoMdSettings />,
    },
  ];

  useEffect(() => {
    setCurrentKey(
      sideBarItems.find((item) => item.to === location.pathname)?.key
    );
  }, [location.pathname]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          colorBgBase: "#ffffff",
          colorTextBase: "#877f7fe0",
          fontFamily: "Poppins, sans-serif",
        },
      }}
    >
      <Layout style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <Sider
          trigger={null}
          width={250}
          collapsible
          collapsed={collapsed}
          style={{ height: "100vh", overflow: "hidden" }}
        >
          <div className="h-[220px] flex justify-center w-full bg-white">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="object-containw-[500px] h-auto"
            />
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[currentKey]}
            items={sideBarItems}
            style={{
              fontSize: "18px",
              height: "calc(100vh - 180px)",
              overflow: "hidden",
            }}
            onClick={(e) => handleNavigate(e)}
          />
        </Sider>

        {/* Main Content */}
        <Layout style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
          {/* Header */}
          <Header
            style={{
              padding: "0 16px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "64px",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px" }}
            />
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Header>

          {/* Content */}
          <Content
            style={{
              margin: 10,
              padding: 24,
              background: "#ffffff",
              borderRadius: "8px",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
