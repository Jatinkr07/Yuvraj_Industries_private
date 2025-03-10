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
  const [tableData, setTableData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      const formattedData = Array.isArray(data) ? data : [];
      setCategories(formattedData);
      flattenData(formattedData); // Transform data for table
    } catch (error) {
      message.error("Failed to fetch categories");
      setCategories([]);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const flattenData = (categories) => {
    const flattened = [];
    categories.forEach((category, catIndex) => {
      const hasSubcategories =
        category.subcategories && category.subcategories.length > 0;
      if (!hasSubcategories) {
        flattened.push({
          key: `${category._id}-none-none`,
          serialNumber: flattened.length + 1,
          categoryId: category._id,
          categoryName: category.name,
          subcategoryName: "None",
          subSubcategoryName: "None",
          image: category.image,
        });
      } else {
        category.subcategories.forEach((subcategory) => {
          const hasSubSubcategories =
            subcategory.subSubcategories &&
            subcategory.subSubcategories.length > 0;
          if (!hasSubSubcategories) {
            flattened.push({
              key: `${category._id}-${subcategory.name}-none`,
              serialNumber: flattened.length + 1,
              categoryId: category._id,
              categoryName: category.name,
              subcategoryName: subcategory.name,
              subSubcategoryName: "None",
              image: category.image,
            });
          } else {
            subcategory.subSubcategories.forEach((subSubcategory) => {
              flattened.push({
                key: `${category._id}-${subcategory.name}-${subSubcategory.name}`,
                serialNumber: flattened.length + 1,
                categoryId: category._id,
                categoryName: category.name,
                subcategoryName: subcategory.name,
                subSubcategoryName: subSubcategory.name,
                image: category.image,
              });
            });
          }
        });
      }
    });
    setTableData(flattened);
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const handleEdit = (record) => {
    const category = categories.find((cat) => cat._id === record.categoryId);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      flattenData(categories);
    } else {
      const filtered = tableData
        .filter(
          (row) =>
            row.categoryName.toLowerCase().includes(value.toLowerCase()) ||
            row.subcategoryName.toLowerCase().includes(value.toLowerCase()) ||
            row.subSubcategoryName.toLowerCase().includes(value.toLowerCase())
        )
        .map((row, index) => ({ ...row, serialNumber: index + 1 }));
      setTableData(filtered);
    }
  };

  const columns = [
    {
      title: "S. No.",
      dataIndex: "serialNumber",
      width: 80,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: "Subcategory",
      dataIndex: "subcategoryName",
      sorter: (a, b) => a.subcategoryName.localeCompare(b.subcategoryName),
    },
    {
      title: "Sub-subcategory",
      dataIndex: "subSubcategoryName",
      sorter: (a, b) =>
        a.subSubcategoryName.localeCompare(b.subSubcategoryName),
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
            onClick={() => handleDelete(record.categoryId)}
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
            placeholder="Search by name"
            suffix={<SearchOutlined />}
            className="max-w-sm"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
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
          dataSource={tableData}
          loading={loading}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200, y: 500 }}
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
