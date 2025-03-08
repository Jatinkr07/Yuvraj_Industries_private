import { useState, useEffect } from "react";
import { Col, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ReplacedCard from "../Card/ReplacedCard";
import axios from "axios";
import { API_URL } from "../../../Services/api";

export default function DealerReplacedPage() {
  const [replacements, setReplacements] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReplacements();
  }, []);

  const fetchReplacements = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/sale/v1/dealer/replacements`,
        { withCredentials: true }
      );
      setReplacements(response.data.replacements || []);
    } catch (error) {
      console.error("Error fetching dealer replacements:", error);
    }
  };

  const filteredReplacements = replacements.filter(
    (item) =>
      item.originalProductId?.serialNumber
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.newProductId?.serialNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "16px" }}>
      <Input
        placeholder="Search by serial number"
        prefix={<SearchOutlined />}
        style={{ marginBottom: "16px", padding: "8px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Row gutter={[16, 16]}>
        {filteredReplacements.length > 0 ? (
          filteredReplacements.map((item) => (
            <Col xs={24} sm={24} md={24} lg={8} xl={24} key={item._id}>
              <ReplacedCard
                type={item.originalProductId?.productName || "SUBMERSIBLE SET"}
                srNo={item.originalProductId?.serialNumber || "N/A"}
                newNo={item.newProductId?.serialNumber || "N/A"}
                replacedDate={new Date(item.replacedDate).toLocaleDateString()}
                warrantyPeriod={`${new Date(
                  item.warrantyStartDate
                ).toLocaleDateString()} - ${new Date(
                  item.warrantyEndDate
                ).toLocaleDateString()}`}
              />
            </Col>
          ))
        ) : (
          <Col span={24} className="text-center py-12">
            <p className="text-lg text-gray-500">
              No replacements recorded yet.
            </p>
          </Col>
        )}
      </Row>
    </div>
  );
}
