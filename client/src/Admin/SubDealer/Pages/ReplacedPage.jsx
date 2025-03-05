import { useState, useEffect } from "react";
import { Col, Input, Row, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ReplacedCard from "../Card/ReplacedCard";
import { API_URL } from "../../../Services/api.js";
import axios from "axios";

export default function ReplacedPage() {
  const [replacements, setReplacements] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReplacements();
  }, []);

  const fetchReplacements = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sale/v1/replacements`, {
        withCredentials: true,
      });
      console.log("Replacements Response:", response.data);
      setReplacements(response.data.replacements || []);
    } catch (error) {
      console.error("Error fetching replacements:", error);
      message.error("Failed to fetch replacements");
    }
  };

  const filteredReplacements = replacements.filter(
    (replacement) =>
      replacement.originalProductId?.productName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      replacement.originalProductId?.serialNumber
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      replacement.newProductId?.serialNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <Input
        placeholder="Search by name, original serial, or new serial"
        prefix={<SearchOutlined />}
        style={{
          marginBottom: "16px",
          padding: "8px",
          width: "100%",
          borderRadius: "100px",
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Row gutter={[16, 16]}>
        {filteredReplacements.length > 0 ? (
          filteredReplacements.map((replacement) => (
            <Col xs={24} sm={12} md={12} lg={12} key={replacement._id}>
              <ReplacedCard
                type={
                  replacement.originalProductId?.productName ||
                  "SUBMERSIBLE SET"
                }
                srNo={replacement.originalProductId?.serialNumber || "N/A"}
                newNo={replacement.newProductId?.serialNumber || "N/A"}
                replacedDate={new Date(
                  replacement.replacedDate
                ).toLocaleDateString()}
                warrantyPeriod={`${new Date(
                  replacement.warrantyStartDate
                ).toLocaleDateString()} - ${new Date(
                  replacement.warrantyEndDate
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
