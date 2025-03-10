/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API_URL, getCategories } from "../../../Services/api.js";

const { TextArea } = Input;

const FormModal = ({ isOpen, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category?._id || initialValues.category,
        subcategory: initialValues.subcategory,
        subSubcategory: initialValues.subSubcategory, // New field for sub-subcategory
        warranty: initialValues.warranty
          ? Math.floor(
              initialValues.warranty /
                (initialValues.warrantyUnit === "years"
                  ? 365
                  : initialValues.warrantyUnit === "months"
                  ? 30
                  : 1)
            )
          : "",
        warrantyUnit: initialValues.warrantyUnit || "days",
      });

      if (initialValues.images && initialValues.images.length > 0) {
        const existingImages = initialValues.images.map((image, index) => ({
          uid: `-${index + 1}`,
          name: image.split("/").pop() || `image-${index + 1}.png`,
          status: "done",
          url: image.startsWith("http") ? image : `${API_URL}/${image}`,
        }));
        setFileList(existingImages);
      } else {
        setFileList([]);
      }

      // Populate subcategories and sub-subcategories based on initial category
      if (initialValues.category) {
        const selectedCategory = categories.find(
          (cat) =>
            cat._id === (initialValues.category?._id || initialValues.category)
        );
        if (selectedCategory) {
          setSubcategories(selectedCategory.subcategories || []);
          const selectedSubcategory = selectedCategory.subcategories.find(
            (sub) => sub.name === initialValues.subcategory
          );
          setSubSubcategories(selectedSubcategory?.subSubcategories || []);
        }
      }
    } else {
      form.resetFields();
      setFileList([]);
      setSubcategories([]);
      setSubSubcategories([]);
    }
  }, [initialValues, form, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      message.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find((cat) => cat._id === categoryId);
    setSubcategories(selectedCategory?.subcategories || []);
    setSubSubcategories([]);
    form.setFieldsValue({ subcategory: null, subSubcategory: null });
  };

  const handleSubcategoryChange = (subcategoryName) => {
    const selectedCategory = categories.find(
      (cat) => cat._id === form.getFieldValue("category")
    );
    const selectedSubcategory = selectedCategory?.subcategories.find(
      (sub) => sub.name === subcategoryName
    );
    setSubSubcategories(selectedSubcategory?.subSubcategories || []);
    form.setFieldsValue({ subSubcategory: null });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = { ...values };

      if (fileList.length > 0) {
        formData.images = fileList.map(
          (file) => file.url || file.originFileObj
        );
      } else if (initialValues?.images?.length > 0 && fileList.length === 0) {
        formData.deleteImage = true;
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Failed to submit the form. Please check the fields.");
    }
  };

  return (
    <Modal
      title={
        <h2 className="text-lg font-semibold">
          {initialValues ? "Edit Product" : "Create New Product"}
        </h2>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Select Category"
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select
              placeholder="Select category"
              className="h-12 bg-gray-100"
              loading={loading}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Select Subcategory"
            name="subcategory"
            rules={[{ required: true, message: "Subcategory is required" }]}
          >
            <Select
              placeholder="Select subcategory"
              className="h-12 bg-gray-100"
              disabled={!subcategories.length}
              onChange={handleSubcategoryChange}
            >
              {subcategories.map((sub) => (
                <Select.Option key={sub.name} value={sub.name}>
                  {sub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Select Sub-subcategory"
            name="subSubcategory"
            rules={[{ required: true, message: "Sub-subcategory is required" }]}
          >
            <Select
              placeholder="Select sub-subcategory"
              className="h-12 bg-gray-100"
              disabled={!subSubcategories.length}
            >
              {subSubcategories.map((subSub) => (
                <Select.Option key={subSub.name} value={subSub.name}>
                  {subSub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Product name is required" }]}
          >
            <Input
              placeholder="Enter product name"
              className="h-12 bg-gray-100"
            />
          </Form.Item>

          <Form.Item
            label="KW/HP"
            name="power"
            rules={[{ required: true, message: "Power is required" }]}
          >
            <Input placeholder="Enter KW/HP" className="h-12 bg-gray-100" />
          </Form.Item>

          <Form.Item
            label="Phase"
            name="phase"
            rules={[{ required: true, message: "Phase is required" }]}
          >
            <Input placeholder="Enter Phase" className="h-12 bg-gray-100" />
          </Form.Item>

          <Form.Item
            label="Volts"
            name="volts"
            rules={[{ required: true, message: "Volts is required" }]}
          >
            <Input placeholder="Enter Volts" className="h-12 bg-gray-100" />
          </Form.Item>

          <Form.Item
            label="Stage"
            name="stage"
            rules={[{ required: true, message: "Stage is required" }]}
          >
            <Input placeholder="Enter stage" className="h-12 bg-gray-100" />
          </Form.Item>

          <Form.Item
            label="Max Discharge"
            name="maxDischarge"
            rules={[{ required: true, message: "Max Discharge is required" }]}
          >
            <Input
              placeholder="Enter max discharge"
              className="h-12 bg-gray-100"
            />
          </Form.Item>

          <Form.Item
            label="Max Head"
            name="maxHead"
            rules={[{ required: true, message: "Max Head is required" }]}
          >
            <Input placeholder="Enter max head" className="h-12 bg-gray-100" />
          </Form.Item>

          <Form.Item
            label="Serial Number"
            name="serialNumber"
            rules={[{ required: true, message: "Serial number is required" }]}
          >
            <Input
              placeholder="Enter serial number"
              className="h-12 bg-gray-100"
            />
          </Form.Item>

          <Form.Item
            label="Quantity (Number)"
            name="quantity"
            rules={[{ required: true, message: "Quantity is required" }]}
          >
            <Input
              type="number"
              placeholder="Enter quantity"
              className="h-12 bg-gray-100"
            />
          </Form.Item>

          <Form.Item
            label="Quantity (Text)"
            name="quantityText"
            rules={[{ required: true, message: "Quantity text is required" }]}
          >
            <Input
              placeholder="Enter quantity text (e.g., 'In Stock')"
              className="h-12 bg-gray-100"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Warranty"
              name="warranty"
              rules={[{ required: true, message: "Warranty is required" }]}
            >
              <Input
                type="number"
                placeholder="Enter warranty"
                className="h-12 bg-gray-100"
              />
            </Form.Item>
            <Form.Item
              label="Warranty Unit"
              name="warrantyUnit"
              rules={[{ required: true, message: "Warranty unit is required" }]}
            >
              <Select placeholder="Unit" className="h-12 bg-gray-100">
                <Select.Option value="days">Days</Select.Option>
                <Select.Option value="months">Months</Select.Option>
                <Select.Option value="years">Years</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Delivery Size"
            name="pipeSize"
            rules={[{ required: true, message: "Delivery Size is required" }]}
          >
            <Input
              placeholder="Enter delivery size"
              className="h-12 bg-gray-100"
            />
          </Form.Item>

          <Form.Item label="Image" name="image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
              maxCount={1}
              action={null}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </div>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <TextArea
            placeholder="Enter product description"
            className="bg-gray-100"
            rows={4}
          />
        </Form.Item>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            onClick={onClose}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="bg-blue-600 px-6 py-2 rounded-lg text-white"
          >
            {initialValues ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormModal;
