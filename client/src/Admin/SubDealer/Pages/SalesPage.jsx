import { useState, useEffect } from "react";
import { Col, Input, Row, Select, Button, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SalesCard from "../Card/SalesCard";
import Bracode from "./BarCode/Barcode";
import axios from "axios";
import { API_URL } from "../../../Services/api";

export default function SubDealerSalesPage() {
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
      const response = await axios.get(`${API_URL}/api/sale/v1/sale/list`, {
        withCredentials: true,
      });
      setSales(response.data.sales || []);
    } catch (error) {
      console.error("Error fetching sub-dealer sales:", error);
      message.error("Failed to fetch sales");
    }
  };

  const fetchReplacements = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sale/v1/replacements`, {
        withCredentials: true,
      });
      console.log("Replacements updated:", response.data.replacements);
    } catch (error) {
      console.error("Error fetching replacements:", error);
    }
  };

  const handleScanSuccess = async (code) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/sale/v1/create`,
        { code },
        { withCredentials: true }
      );
      setSales((prev) => [response.data.sale, ...prev]);
      message.success("Sale created successfully");
      setIsScannerOpen(false);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to create sale");
    }
  };

  const handleReplaceScanSuccess = async (code) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/sale/v1/replace/${selectedSaleId}`,
        { code },
        { withCredentials: true }
      );
      const newSale = response.data.sale;

      // Update sales: remove original, add new sale
      setSales((prev) => {
        const updatedSales = prev.filter((sale) => sale._id !== selectedSaleId);
        return [newSale, ...updatedSales];
      });

      message.success("Product replaced successfully");
      setIsReplaceScannerOpen(false);
      setSelectedSaleId(null);
      fetchReplacements(); // Updates the replaced list
    } catch (error) {
      console.error("Replace Error:", error.response?.data);
      message.error(
        error.response?.data?.message || "Failed to replace product"
      );
    }
  };

  const handleReplaceClick = (saleId) => {
    const sale = sales.find((s) => s._id === saleId);
    if (sale) {
      const isWarrantyActive = new Date(sale.warrantyEndDate) > new Date();
      if (!isWarrantyActive) {
        message.warning("Cannot replace product; warranty has expired.");
        return;
      }
      setSelectedSaleId(saleId);
      setIsReplaceScannerOpen(true);
    }
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
    <div style={{ padding: "16px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "16px",
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsScannerOpen(true)}
          style={{ backgroundColor: "#7CB9E8", borderColor: "#7CB9E8" }}
        >
          Add New
        </Button>
      </div>

      <Input
        placeholder="Search by name, barcode, or serial"
        prefix={<SearchOutlined />}
        style={{ marginBottom: "16px", borderRadius: "10px", padding: "9px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
                isWarrantyActive={new Date(sale.warrantyEndDate) > new Date()}
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
