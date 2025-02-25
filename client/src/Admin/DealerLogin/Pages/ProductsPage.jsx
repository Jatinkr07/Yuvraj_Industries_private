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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDealerProducts = async () => {
    try {
      setLoading(true);
      const response = await getDealerProducts();
      setProducts(response.products || []);
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerProducts();
  }, []);

  const handleScanSuccess = async (code) => {
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

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-24">
          <Select
            placeholder="Category"
            style={{ width: 200, height: 40 }}
            options={[
              { value: "category1", label: "Category 1" },
              { value: "category2", label: "Category 2" },
            ]}
          />
          <button
            className="px-3 py-2 bg-[#7CB9E8] text-white hover:bg-white hover:text-[#7CB9E8] border border-[#7CB9E8] font-[500] rounded-md"
            icon={<QrcodeOutlined />}
            onClick={() => setIsScannerOpen(true)}
          >
            Scan Product
          </button>
        </div>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 500, padding: "12px", borderRadius: "20px" }}
        />
      </div>

      <Row gutter={[16, 16]} className="py-12">
        {products.map((product) => (
          <Col key={product._id} xs={24} sm={24} md={12} lg={12} xl={12}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
