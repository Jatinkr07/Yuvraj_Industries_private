/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Col, Input, Row, Select, Button, message } from "antd";
import { SearchOutlined, QrcodeOutlined } from "@ant-design/icons";
import ProductCard from "../Card/ProductCard";
import QRScanner from "./BarCode/QRScanner";
import {
  assignProductToDealer,
  getDealerProducts,
} from "../../../Services/api";

export default function ProductsPage({
  dealerId,
  dealerName,
  isAdminView = false,
}) {
  const [products, setProducts] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDealerProducts = async () => {
    try {
      setLoading(true);
      const response = await getDealerProducts(dealerId);
      setProducts(response.products || []);
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerProducts();
  }, [dealerId]);

  const handleScanSuccess = async (code) => {
    if (isAdminView) return;
    try {
      console.log("CODE --->", code);
      const response = await assignProductToDealer({ code });
      setProducts((prev) => [...prev, response.product]);
      message.success("Product assigned successfully");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to assign product"
      );
    }
    setIsScannerOpen(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 w-full min-h-screen overflow-y-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Select
            placeholder="Category"
            className="w-full md:w-48"
            options={[
              { value: "all", label: "All Categories" },
              { value: "category1", label: "Category 1" },
              { value: "category2", label: "Category 2" },
            ]}
          />
          {!isAdminView && (
            <Button
              className="w-full md:w-auto px-3 py-2 bg-[#7CB9E8] text-white hover:bg-white hover:text-[#7CB9E8] border border-[#7CB9E8] font-[500] rounded-md"
              icon={<QrcodeOutlined />}
              onClick={() => setIsScannerOpen(true)}
            >
              Scan Barcode
            </Button>
          )}
          {isAdminView && dealerName && (
            <h2 className="text-lg md:text-xl font-semibold truncate">
              Products for {dealerName}
            </h2>
          )}
        </div>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="w-full md:w-96"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <Row gutter={[16, 16]} className="py-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col
                key={product._id}
                xs={24} // 1 card per row on extra small screens
                sm={12} // 2 cards per row on small screens
                md={12} // 2 cards per row on medium screens
                lg={12} // 2 cards per row on large screens
                xl={12} // 2 cards per row on extra large screens
                className="flex justify-center"
              >
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <div className="text-center py-8 text-gray-500">
                No products assigned to {isAdminView ? dealerName : "you"}
              </div>
            </Col>
          )}
        </Row>
      </div>

      {!isAdminView && (
        <QRScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
  );
}
