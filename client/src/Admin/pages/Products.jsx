/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { Table, Input, Button, Select, Modal, message, QRCode } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  QrcodeOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver";
import FormModal from "../components/products/FormModal";
import ProductTemplate from "./Template/Template.jsx";
import InnerTemplate from "./Template/InnerTemplate.jsx"; // Updated import name
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../Services/api.js";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isInnerTemplateModalOpen, setIsInnerTemplateModalOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchProducts = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      try {
        setLoading(true);
        const data = await getProducts({
          page,
          limit: pageSize,
          search: searchText,
        });
        setProducts(data.products);
        setPagination((prev) => ({
          ...prev,
          current: data.page,
          total: data.total,
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    [searchText, pagination.current, pagination.pageSize]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async (values) => {
    try {
      await createProduct(values);
      message.success(`Successfully created ${values.quantity} products`);
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      message.error("This serial number is already created. Try a new one.");
      console.error("Error creating product:", error);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchProducts(newPagination.current, newPagination.pageSize);
  };

  const handleUpdate = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleEdit = async (values) => {
    try {
      await updateProduct(editingProduct._id, values);
      message.success("Product updated successfully");
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      message.error("Failed to update product");
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success("Product deleted successfully");
          fetchProducts();
        } catch (error) {
          message.error("Failed to delete product");
          console.error("Error deleting product:", error);
        }
      },
    });
  };

  const showQRCode = (product) => {
    setSelectedProduct(product);
    setIsQRModalOpen(true);
  };

  const showTemplate = (product) => {
    setSelectedProduct(product);
    setIsTemplateModalOpen(true);
  };

  const showInnerTemplate = (product) => {
    setSelectedProduct(product);
    setIsInnerTemplateModalOpen(true);
  };

  const downloadQRCode = () => {
    if (!selectedProduct) return;

    const qrCanvas = document.querySelector(".ant-qrcode canvas");
    if (!qrCanvas) {
      message.error("QR Code not found!");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const qrWidth = qrCanvas.width;
    const qrHeight = qrCanvas.height;
    const textHeight = 30;
    canvas.width = qrWidth;
    canvas.height = qrHeight + textHeight;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(qrCanvas, 0, 0);

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(selectedProduct.serialNumber, qrWidth / 2, qrHeight + 20);

    canvas.toBlob((blob) => {
      saveAs(blob, `qrcode-${selectedProduct.serialNumber}.png`);
    });
  };

  const handleSearch = useCallback((value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleCategoryFilter = useCallback((value) => {
    setCategoryFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const columns = [
    {
      title: "S. No.",
      dataIndex: "sNo",
      key: "sNo",
      width: 80,
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Product S. No.",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 220,
    },
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
      width: 150,
    },
    {
      title: "QR Code",
      key: "qrcode",
      width: 150,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showQRCode(record)}
          icon={<QrcodeOutlined />}
        >
          View QR Code
        </Button>
      ),
    },
    {
      title: "Inner Template",
      key: "innerTemplate",
      width: 150,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showInnerTemplate(record)}
          icon={<EyeOutlined />}
        >
          View Template
        </Button>
      ),
    },
    {
      title: "Outer Template",
      key: "outerTemplate",
      width: 150,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showTemplate(record)}
          icon={<EyeOutlined />}
        >
          View Template
        </Button>
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      width: 120,
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
      width: 120,
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      key: "addedOn",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-4">
          <EditOutlined
            className="text-blue-600 text-lg cursor-pointer"
            onClick={() => handleUpdate(record)}
          />
          <DeleteOutlined
            className="text-red-500 text-lg cursor-pointer"
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Product List</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add New
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Select
            value={categoryFilter}
            style={{ width: 120 }}
            onChange={handleCategoryFilter}
            options={[
              { value: "all", label: "All Categories" },
              { value: "pump", label: "Pump" },
              { value: "motor", label: "Motor" },
              { value: "spare", label: "Spare Parts" },
            ]}
          />
          <div className="flex-grow">
            <Input
              placeholder="Search by name or serial number"
              suffix={<SearchOutlined />}
              className="max-w-sm"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200, y: 500 }}
          loading={loading}
          rowKey="_id"
        />

        <FormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={editingProduct ? handleEdit : handleCreate}
          initialValues={editingProduct}
        />

        <Modal
          title="Product QR Code"
          open={isQRModalOpen}
          onCancel={() => setIsQRModalOpen(false)}
          footer={[
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadQRCode}
            >
              Download
            </Button>,
          ]}
          width={400}
        >
          {selectedProduct && (
            <div className="flex flex-col items-center">
              <QRCode
                value={selectedProduct.barcode || selectedProduct.serialNumber}
                size={150}
              />
              <p className="mt-4 text-center text-gray-600">
                Serial Number: {selectedProduct.serialNumber}
              </p>
            </div>
          )}
        </Modal>

        <ProductTemplate
          product={selectedProduct}
          visible={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
        />

        <InnerTemplate
          product={selectedProduct}
          visible={isInnerTemplateModalOpen}
          onClose={() => setIsInnerTemplateModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Products;
