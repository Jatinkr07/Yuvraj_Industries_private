import { Col, Input, Row, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SalesCard from "../Card/SalesCard";
import { Link } from "react-router-dom";

export default function SalesPage() {
  const salesData = [
    {
      type: "SUBMERSIBLE SET",
      srNo: "24517056",
      date: "18/05/2023",
      warrantyPeriod: "18/05/2023 - 17/05/2025",
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "110px",
          flexWrap: "wrap",
        }}
      >
        <Select
          placeholder="Warranty"
          style={{ width: 200, height: 40 }}
          options={[
            { value: "active", label: "Active" },
            { value: "expired", label: "Expired" },
          ]}
        />
        <Link to="/sale/barcode">
          <button
            className="px-3 py-2 border border-[#7CB9E8] bg-[#7CB9E8] text-white hover:bg-white hover:text-[#7CB9E8] rounded-md  font-[500]"
            icon={<PlusOutlined />}
          >
            Add New
          </button>
        </Link>
      </div>

      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        style={{ marginBottom: "16px", borderRadius: "10px", padding: "9px" }}
      />

      <Row gutter={[16, 16]}>
        {salesData.map((sale, index) => (
          <Col xs={24} sm={24} md={12} lg={8} xl={24} key={index}>
            <SalesCard />
          </Col>
        ))}
      </Row>
    </div>
  );
}
