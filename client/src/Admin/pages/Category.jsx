/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Table, Input, Button, Select, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import FormModal from "../components/category/FormModal";
import { getCategories, deleteCategory, API_URL } from "../../Services/api";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories function
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Run fetchCategories only on mount
  useEffect(() => {
    fetchCategories();
  }, []); // Empty dependency array ensures it runs once on mount

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Category deleted successfully!");
      fetchCategories(); // Refresh after delete
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const columns = [
    {
      title: "S. No.",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
      render: (image) =>
        image ? (
          <img
            src={`${API_URL}/uploads/${image}`}
            alt="Category"
            className="w-16 h-16 object-cover rounded-md"
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Products",
      width: 100,
      render: () => (
        <EyeOutlined className="text-blue-600 text-lg cursor-pointer" />
      ),
    },
    {
      title: "Action",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-4">
          <EditOutlined
            className="text-blue-600 text-lg cursor-pointer"
            onClick={() => handleEdit(record)}
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
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Categories List</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add New
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Select
            defaultValue="show_all"
            style={{ width: 120 }}
            options={[
              { value: "show_all", label: "Show all" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <Input
            placeholder="Search"
            suffix={<SearchOutlined />}
            className="max-w-sm"
          />
          <Select
            defaultValue="category"
            style={{ width: 120 }}
            options={[
              { value: "category", label: "Category" },
              { value: "pump", label: "Pump" },
              { value: "motor", label: "Motor" },
              { value: "spare", label: "Spare Parts" },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        refreshData={fetchCategories}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default Category;
