import { motion } from "framer-motion";
import { Card, Row, Col } from "antd";
import {
  ShopOutlined,
  TeamOutlined,
  FileTextOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const dashboardItems = [
    {
      icon: <ShopOutlined style={{ fontSize: 24, color: "#16a34a" }} />,
      label: "Products",
      description: "Manage inventory",
      href: "/dealer/products",
    },
    {
      icon: <TeamOutlined style={{ fontSize: 24, color: "#16a34a" }} />,
      label: "Sub Dealers",
      description: "Dealer management",
      href: "/dealer/subdealers",
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 24, color: "#16a34a" }} />,
      label: "Sales",
      description: "Sales records",
      href: "/dealer/sales",
    },
    {
      icon: <SyncOutlined style={{ fontSize: 24, color: "#16a34a" }} />,
      label: "Replaced",
      description: "Replacement history",
      href: "/dealer/replaced",
    },
  ];

  return (
    <Row gutter={[16, 16]} className="py-12 lg:px-12">
      {dashboardItems.map((item, index) => (
        <Col xs={12} sm={12} md={6} lg={12} key={item.href}>
          <Link to={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {item.icon}
                  <span style={{ fontWeight: 500, fontSize: "16px" }}>
                    {item.label}
                  </span>
                  <span style={{ color: "#6B7280", fontSize: "14px" }}>
                    {item.description}
                  </span>
                </div>
              </Card>
            </motion.div>
          </Link>
        </Col>
      ))}
    </Row>
  );
}
