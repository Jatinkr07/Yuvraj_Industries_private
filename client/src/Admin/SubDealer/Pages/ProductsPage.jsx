// SubDealerProductsPage.jsx
import { useState, useEffect } from "react";
import { Col, Row, Input, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ProductCard from "../Card/ProductCard";
import Bracode from "./BarCode/Barcode";
import axios from "axios";
import { API_URL } from "../../../Services/api";

export default function SubDealerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dealer/subdealer/products`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetch Products Response:", response.data);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching sub-dealer products:", error);
      setProducts([]);
      message.error("Failed to fetch products");
    }
  };

  const handleScanSuccess = async (code) => {
    try {
      console.log("Assigning product with code:", code);
      const response = await axios.post(
        `${API_URL}/api/products/subdealer/assign-product`,
        { code },
        { withCredentials: true }
      );
      console.log("Product Assigned:", response.data.product);
      setProducts((prev) => [response.data.product, ...prev]);
      message.success("Product assigned successfully");
      setIsScannerOpen(false);
    } catch (error) {
      console.error("Error assigning product:", error.response?.data || error);
      message.error(
        error.response?.data?.message || "Failed to assign product"
      );
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          product.productName?.toLowerCase().includes(search.toLowerCase()) ||
          product.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
          product.barcode?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            placeholder="Category"
            style={{ width: 200, height: 40 }}
            options={[
              { value: "all", label: "All Categories" },
              { value: "category1", label: "Category 1" },
              { value: "category2", label: "Category 2" },
            ]}
          />
          <button
            className="px-3 py-2 bg-[#7CB9E8] text-white hover:bg-white hover:text-[#7CB9E8] border border-[#7CB9E8] font-[500] rounded-md"
            onClick={() => setIsScannerOpen(true)}
          >
            Assign Product
          </button>
        </div>
        <Input
          placeholder="Search by name, serial, or barcode"
          prefix={<SearchOutlined />}
          style={{ width: 300, padding: "8px", borderRadius: "20px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Row gutter={[16, 16]}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={12} lg={12} key={product._id}>
              <ProductCard
                product={{
                  productName: product.productName,
                  stage: product.stage,
                  power: product.power,
                  pipeSize: product.pipeSize,
                  warranty: product.warranty,
                  warrantyUnit: product.warrantyUnit,
                  warrantyStartDate: product.warrantyStartDate,
                  warrantyEndDate: product.warrantyEndDate,
                  serialNumber: product.serialNumber,
                  addedOn: product.assignedToSubDealerAt,
                  quantity: product.quantity,
                }}
              />
            </Col>
          ))
        ) : (
          <Col span={24} className="text-center py-12">
            <p className="text-lg text-gray-500">No products assigned yet.</p>
          </Col>
        )}
      </Row>

      <Bracode
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
