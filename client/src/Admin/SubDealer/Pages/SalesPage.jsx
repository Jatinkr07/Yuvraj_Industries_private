// SalesPage.jsx
import { useState, useEffect } from "react";
import { Col, Input, Row, Select, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SalesCard from "../Card/SalesCard";
import Bracode from "./BarCode/Barcode";
import { API_URL, getSales } from "../../../Services/api.js";
import axios from "axios";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReplaceScannerOpen, setIsReplaceScannerOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await getSales();
      console.log("Sales Response:", response);
      setSales(response.sales || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      message.error("Failed to fetch sales");
    }
  };

  const handleScanSuccess = async (code) => {
    try {
      console.log("Creating sale with code:", code);
      const response = await axios.post(
        `${API_URL}/api/sale/v1/create`,
        { code },
        { withCredentials: true }
      );
      console.log("Sale Created:", response.data.sale);
      setSales((prev) => [response.data.sale, ...prev]);
      message.success("Sale created successfully");
      setIsScannerOpen(false);
    } catch (error) {
      console.error("Error creating sale:", error.response?.data || error);
      message.error(error.response?.data?.message || "Failed to create sale");
    }
  };

  const handleReplaceScanSuccess = async (code) => {
    try {
      console.log(
        "Replacing product with code:",
        code,
        "for sale:",
        selectedSaleId
      );
      const response = await axios.put(
        `${API_URL}/api/sale/v1/replace/${selectedSaleId}`,
        { code },
        { withCredentials: true }
      );
      console.log("Product Replaced:", response.data);
      setSales((prev) => prev.filter((sale) => sale._id !== selectedSaleId));
      message.success("Product replaced and reassigned to sub-dealer");
      setIsReplaceScannerOpen(false);
      setSelectedSaleId(null);
    } catch (error) {
      console.error("Error replacing product:", error.response?.data || error);
      message.error(
        error.response?.data?.message || "Failed to replace product"
      );
    }
  };

  const handleReplaceClick = (saleId) => {
    setSelectedSaleId(saleId);
    setIsReplaceScannerOpen(true);
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.productId?.productName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      sale.productId?.barcode?.toLowerCase().includes(search.toLowerCase()) ||
      sale.productId?.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            placeholder="Warranty"
            style={{ width: 200, height: 40 }}
            options={[
              { value: "active", label: "Active" },
              { value: "expired", label: "Expired" },
            ]}
          />
          <button
            className="px-3 py-2 bg-[#7CB9E8] text-white hover:bg-white hover:text-[#7CB9E8] border border-[#7CB9E8] font-[500] rounded-md"
            onClick={() => setIsScannerOpen(true)}
          >
            <PlusOutlined /> Add New
          </button>
        </div>
        <Input
          placeholder="Search by name, barcode, or serial"
          prefix={<SearchOutlined />}
          style={{ width: 300, padding: "8px", borderRadius: "20px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Row gutter={[16, 16]}>
        {filteredSales.length > 0 ? (
          filteredSales.map((sale) => (
            <Col xs={24} sm={12} md={12} lg={12} key={sale._id}>
              <SalesCard
                type={sale.productId?.productName || "SUBMERSIBLE SET"}
                srNo={sale.productId?.serialNumber || "N/A"}
                date={new Date(sale.warrantyStartDate).toLocaleDateString()}
                warrantyPeriod={`${sale.warrantyPeriod} (${new Date(
                  sale.warrantyStartDate
                ).toLocaleDateString()} - ${new Date(
                  sale.warrantyEndDate
                ).toLocaleDateString()})`}
                warrantyEndDate={sale.warrantyEndDate}
                onReplace={() => handleReplaceClick(sale._id)}
              />
            </Col>
          ))
        ) : (
          <Col span={24} className="text-center py-12">
            <p className="text-lg text-gray-500">No sales recorded yet.</p>
          </Col>
        )}
      </Row>
      <Bracode
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
      <Bracode
        isOpen={isReplaceScannerOpen}
        onClose={() => {
          setIsReplaceScannerOpen(false);
          setSelectedSaleId(null);
        }}
        onScanSuccess={handleReplaceScanSuccess}
      />
    </div>
  );
}
