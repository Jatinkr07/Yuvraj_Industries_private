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
import { toPng } from "html-to-image";
import QRCodeLib from "qrcode";
import FormModal from "../components/products/FormModal";
import ProductTemplate from "./Template/Template.jsx";
import InnerTemplate from "./Template/InnerTemplate.jsx";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  bulkAssignProductsToDealer,
  // getDealersAll,
  getCategories,
} from "../../Services/api.js";

// Utility function (unchanged)
const generateAndDownloadTemplate = async (products, type) => {
  const offscreenContainer = document.createElement("div");
  offscreenContainer.style.position = "absolute";
  offscreenContainer.style.left = "-9999px";
  document.body.appendChild(offscreenContainer);

  try {
    for (const product of products) {
      const tempContainer = document.createElement("div");
      offscreenContainer.appendChild(tempContainer);
      tempContainer.innerHTML = `
        <div class="${
          type === "outer" ? "product-template-card" : "inner-template-card"
        }">
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #D1D5DB; background-color: #F9FAFB;">
            <h3>${product.serialNumber || "N/A"}</h3>
            <p>${product.productName || "N/A"}</p>
          </div>
        </div>
      `;
      const element = tempContainer.querySelector(
        `.${type === "outer" ? "product-template-card" : "inner-template-card"}`
      );
      if (!element) {
        console.error(
          "Template element not found for product:",
          product.serialNumber
        );
        continue;
      }
      const dataUrl = await toPng(element, { cacheBust: true });
      saveAs(dataUrl, `${type}-template-${product.serialNumber}.png`);
      offscreenContainer.removeChild(tempContainer);
    }
  } catch (error) {
    console.error(`Error generating ${type} templates:`, error);
    message.error(`Failed to generate ${type} templates`);
  } finally {
    document.body.removeChild(offscreenContainer);
  }
};

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isInnerTemplateModalOpen, setIsInnerTemplateModalOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // Uses category name
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCategories = useCallback(async () => {
    try {
      const categoryData = await getCategories();
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
      setCategories([]);
    }
  }, []);

  const fetchProducts = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: pageSize,
          search: searchText,
        };
        if (categoryFilter !== "all") {
          params.categoryName = categoryFilter; // Send category name to backend
        }
        const data = await getProducts(params);
        setProducts(data.products || []);
        setPagination((prev) => ({
          ...prev,
          current: data.page,
          total: data.total,
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Failed to fetch products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [searchText, categoryFilter, pagination.current, pagination.pageSize]
  );

  // const fetchDealers = useCallback(async () => {
  //   try {
  //     const dealerData = await getDealersAll();
  //     setDealers(Array.isArray(dealerData) ? dealerData : []);
  //   } catch (error) {
  //     console.error("Error fetching dealers:", error.message);
  //     message.error("Failed to fetch dealers: " + error.message);
  //     setDealers([]);
  //   }
  // }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    // fetchDealers();
  }, [fetchCategories, fetchProducts]);

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

  const handleBulkAssign = async (dealerId) => {
    try {
      await bulkAssignProductsToDealer({
        productIds: selectedRowKeys,
        dealerId,
      });
      message.success(
        `Successfully assigned ${selectedRowKeys.length} products to dealer`
      );
      setSelectedRowKeys([]);
      fetchProducts();
    } catch (error) {
      message.error("Failed to bulk assign products");
      console.error("Error bulk assigning:", error);
    }
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

  const downloadQRCode = (product = selectedProduct) => {
    if (!product) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 150;
    canvas.width = size;
    canvas.height = size + 30;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    QRCodeLib.toCanvas(
      canvas,
      product.barcode || product.serialNumber,
      { width: size, height: size, margin: 0 },
      (error) => {
        if (error) {
          console.error("Error generating QR code:", error);
          return;
        }
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(product.serialNumber, size / 2, size + 20);
        canvas.toBlob((blob) => {
          saveAs(blob, `qrcode-${product.serialNumber}.png`);
        });
      }
    );
  };

  const handleBulkDownloadQR = () => {
    const selectedProducts = products.filter((p) =>
      selectedRowKeys.includes(p._id)
    );
    selectedProducts.forEach((product) => downloadQRCode(product));
  };

  const handleBulkInnerTemplate = () => {
    const selectedProducts = products.filter((p) =>
      selectedRowKeys.includes(p._id)
    );
    if (selectedProducts.length === 1) {
      setSelectedProduct(selectedProducts[0]);
      setIsInnerTemplateModalOpen(true);
    } else {
      generateAndDownloadTemplate(selectedProducts, "inner");
    }
  };

  const handleBulkOuterTemplate = () => {
    const selectedProducts = products.filter((p) =>
      selectedRowKeys.includes(p._id)
    );
    if (selectedProducts.length === 1) {
      setSelectedProduct(selectedProducts[0]);
      setIsTemplateModalOpen(true);
    } else {
      generateAndDownloadTemplate(selectedProducts, "outer");
    }
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Product List</h1>
          <div className="flex gap-2">
            {selectedRowKeys.length > 0 && (
              <>
                <Select
                  placeholder="Bulk Assign Dealer"
                  style={{ width: 200 }}
                  onChange={handleBulkAssign}
                  allowClear
                  loading={!dealers.length}
                >
                  {dealers.map((dealer) => (
                    <Select.Option key={dealer._id} value={dealer._id}>
                      {`${dealer.firstName} ${dealer.lastName}`}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleBulkDownloadQR}
                >
                  Download QR Codes
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleBulkInnerTemplate}
                >
                  Inner Templates
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleBulkOuterTemplate}
                >
                  Outer Templates
                </Button>
              </>
            )}
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
        </div>

        <div className="flex gap-4 mb-6">
          <Select
            value={categoryFilter}
            style={{ width: 200 }}
            onChange={handleCategoryFilter}
            loading={!categories.length}
            placeholder="Select Category"
          >
            <Select.Option value="all">All Categories</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category.name}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
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
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1400, y: 500 }}
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
              onClick={() => downloadQRCode()}
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
