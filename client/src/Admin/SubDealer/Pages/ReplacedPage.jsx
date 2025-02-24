import { Col, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ReplacedCard from "../Card/ReplacedCard";

export default function ReplacedPage() {
  const replacedData = [
    {
      type: "SUBMERSIBLE SET",
      srNo: "24507056",
      newNo: "25020F567",
      replacedDate: "24/07/2023",
      warrantyPeriod: "18/05/2023 - 17/05/2025",
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        style={{
          marginBottom: "16px",
          padding: "8px",
          width: "20%",
          borderRadius: "100px",
        }}
      />

      <Row gutter={[16, 16]}>
        {replacedData.map((item, index) => (
          <Col xs={24} sm={24} md={24} lg={8} xl={24} key={index}>
            <ReplacedCard />
          </Col>
        ))}
      </Row>
    </div>
  );
}
