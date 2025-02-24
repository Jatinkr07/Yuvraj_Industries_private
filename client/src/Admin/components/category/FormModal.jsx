/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
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

  useEffect(() => {
    // Only run when modal opens or initialData changes
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({ category: initialData.name });
        if (initialData.image) {
          const imageUrl = `${API_URL}/${initialData.image}`;
          setPreviewUrl(imageUrl);
          setFileList([
            { uid: "-1", name: "image", status: "done", url: imageUrl },
          ]);
          setImageDeleted(false);
        }
      } else {
        form.resetFields();
        setFileList([]);
        setPreviewUrl(null);
        setImageDeleted(false);
      }
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

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.category);

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
      onClose();
      refreshData(); // Trigger refresh only once after success
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
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Category Name"
          name="category"
          rules={[{ required: true, message: "Category name is required" }]}
        >
          <Input placeholder="Enter Name" className="h-12 bg-gray-100" />
        </Form.Item>

        <Form.Item label="Image">
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
              onError={(e) => (e.target.src = "/fallback-image.jpg")} // Fallback for broken images
            />
            <Button
              className="absolute top-2 right-2 bg-red-500 text-white"
              icon={<DeleteOutlined />}
              onClick={removeImage}
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
