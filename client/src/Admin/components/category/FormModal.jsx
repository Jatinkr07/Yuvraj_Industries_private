/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message, Space, List } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  API_URL,
  createCategory,
  updateCategory,
  removeCategoryImage,
} from "../../../Services/api";

const FormModal = ({ isOpen, onClose, refreshData, initialData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subSubcategoryName, setSubSubcategoryName] = useState("");
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] =
    useState(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({ category: initialData.name });
        setSubcategories(initialData.subcategories || []);
        if (initialData.image) {
          const imageUrl = `${API_URL}/${initialData.image}`;
          setPreviewUrl(imageUrl);
          setFileList([
            { uid: "-1", name: "image", status: "done", url: imageUrl },
          ]);
          setImageDeleted(false);
        } else {
          setFileList([]);
          setPreviewUrl(null);
          setImageDeleted(false);
        }
      } else {
        form.resetFields();
        setFileList([]);
        setPreviewUrl(null);
        setImageDeleted(false);
        setSubcategories([]);
      }
      setSubcategoryName("");
      setSubSubcategoryName("");
      setSelectedSubcategoryIndex(null);
    }
  }, [isOpen, initialData, form]);

  const handleFileChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const file = newFileList[0];
      setFileList([file]);
      if (file.originFileObj) {
        setPreviewUrl(URL.createObjectURL(file.originFileObj));
      }
      setImageDeleted(false);
    } else {
      setFileList([]);
      setPreviewUrl(null);
      setImageDeleted(true);
    }
  };

  const removeImage = async () => {
    if (initialData?.image) {
      try {
        await removeCategoryImage(initialData._id);
        message.success("Image removed successfully!");
        setFileList([]);
        setPreviewUrl(null);
        setImageDeleted(true);
      } catch (error) {
        message.error("Failed to remove image");
      }
    } else {
      setFileList([]);
      setPreviewUrl(null);
      setImageDeleted(true);
    }
  };

  const addSubcategory = () => {
    if (!subcategoryName.trim()) {
      message.error("Subcategory name is required");
      return;
    }
    const newSubcategory = { name: subcategoryName, subSubcategories: [] };
    setSubcategories([...subcategories, newSubcategory]);
    setSubcategoryName("");
  };

  const addSubSubcategory = () => {
    if (!subSubcategoryName.trim()) {
      message.error("Sub-subcategory name is required");
      return;
    }
    if (selectedSubcategoryIndex === null) {
      message.error("Please select a subcategory first");
      return;
    }
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[selectedSubcategoryIndex].subSubcategories.push({
      name: subSubcategoryName,
    });
    setSubcategories(updatedSubcategories);
    setSubSubcategoryName("");
  };

  const removeSubcategory = (index) => {
    const updatedSubcategories = subcategories.filter((_, i) => i !== index);
    setSubcategories(updatedSubcategories);
    if (selectedSubcategoryIndex === index) {
      setSelectedSubcategoryIndex(null);
    }
  };

  const removeSubSubcategory = (subIndex, subSubIndex) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[subIndex].subSubcategories = updatedSubcategories[
      subIndex
    ].subSubcategories.filter((_, i) => i !== subSubIndex);
    setSubcategories(updatedSubcategories);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.category);
    formData.append("subcategories", JSON.stringify(subcategories));

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    } else if (imageDeleted) {
      formData.append("image", "");
    }

    try {
      if (initialData) {
        await updateCategory(initialData._id, formData);
        message.success("Category updated successfully!");
      } else {
        await createCategory(formData);
        message.success("Category created successfully!");
      }
      form.resetFields();
      setFileList([]);
      setPreviewUrl(null);
      setImageDeleted(false);
      setSubcategories([]);
      setSubcategoryName("");
      setSubSubcategoryName("");
      setSelectedSubcategoryIndex(null);
      onClose();
      refreshData();
    } catch (error) {
      message.error("Error saving category");
    }
  };

  return (
    <Modal
      title={initialData ? "Edit Category" : "Create New Category"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Category Name"
          name="category"
          rules={[{ required: true, message: "Category name is required" }]}
        >
          <Input
            placeholder="Enter Category Name"
            className="h-12 bg-gray-100"
          />
        </Form.Item>

        <Form.Item label="Image (Optional)">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
          >
            <Button
              icon={<UploadOutlined />}
              className="w-full h-12 bg-gray-100 text-gray-600 flex items-center justify-start"
            >
              Upload Category Image
            </Button>
          </Upload>
        </Form.Item>

        {previewUrl && (
          <div className="relative mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md"
            />
            <Button
              className="absolute top-2 right-2 bg-red-500 text-white"
              icon={<DeleteOutlined />}
              onClick={removeImage}
            />
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Subcategories</h3>
          <Space direction="vertical" className="w-full">
            <Input
              placeholder="Enter Subcategory Name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className="h-12 bg-gray-100"
            />
            <Button
              type="dashed"
              onClick={addSubcategory}
              icon={<PlusOutlined />}
              className="w-full h-12"
            >
              Add Subcategory
            </Button>
          </Space>
          <List
            dataSource={subcategories}
            renderItem={(subcategory, subIndex) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeSubcategory(subIndex)}
                  />,
                  <Button
                    type="link"
                    onClick={() => setSelectedSubcategoryIndex(subIndex)}
                  >
                    Add Sub-subcategory
                  </Button>,
                ]}
              >
                {subcategory.name}
              </List.Item>
            )}
            className="mt-2"
          />
        </div>

        {selectedSubcategoryIndex !== null && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              Sub-subcategories for{" "}
              {subcategories[selectedSubcategoryIndex].name}
            </h3>
            <Space direction="vertical" className="w-full">
              <Input
                placeholder="Enter Sub-subcategory Name"
                value={subSubcategoryName}
                onChange={(e) => setSubSubcategoryName(e.target.value)}
                className="h-12 bg-gray-100"
              />
              <Button
                type="dashed"
                onClick={addSubSubcategory}
                icon={<PlusOutlined />}
                className="w-full h-12"
              >
                Add Sub-subcategory
              </Button>
            </Space>
            <List
              dataSource={
                subcategories[selectedSubcategoryIndex].subSubcategories
              }
              renderItem={(subSubcategory, subSubIndex) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        removeSubSubcategory(
                          selectedSubcategoryIndex,
                          subSubIndex
                        )
                      }
                    />,
                  ]}
                >
                  {subSubcategory.name}
                </List.Item>
              )}
              className="mt-2"
            />
          </div>
        )}

        <div className="flex justify-start mt-10 gap-4">
          <Button
            onClick={onClose}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 px-6 py-2 rounded-lg text-white"
          >
            {initialData ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormModal;
