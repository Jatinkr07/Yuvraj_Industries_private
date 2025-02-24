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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category?._id || initialValues.category,
        productName: initialValues.productName,
        power: initialValues.power,
        stage: initialValues.stage,
        maxDischarge: initialValues.maxDischarge,
        maxHead: initialValues.maxHead,
        warranty: initialValues.warranty,
        pipeSize: initialValues.pipeSize,
        description: initialValues.description,
        serialNumber: initialValues.serialNumber,
        quantity: initialValues.quantity,
      });

      if (initialValues.images && initialValues.images.length > 0) {
        const existingImages = initialValues.images.map((image, index) => {
          const imageUrl = image.startsWith("http")
            ? image
            : `${API_URL}/${image}`;

          return {
            uid: `-${index + 1}`,
            name: image.split("/").pop() || `image-${index + 1}.png`,
            status: "done",
            url: imageUrl,
          };
        });
        setFileList(existingImages);
      } else {
        setFileList([]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialValues, form]);

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
            label="Select Category"
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select
              placeholder="Select category"
              className="h-12 bg-gray-100"
              loading={loading}
            >
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Power"
            name="power"
            rules={[{ required: true, message: "Power is required" }]}
          >
            <Input placeholder="Enter power" className="h-12 bg-gray-100" />
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
            label="Quantity"
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
            label="Warranty Period"
            name="warranty"
            rules={[{ required: true, message: "Warranty period is required" }]}
          >
            <Input
              placeholder="Enter warranty period"
              className="h-12 bg-gray-100"
            />
          </Form.Item>

          <Form.Item
            label="Pipe Size"
            name="pipeSize"
            rules={[{ required: true, message: "Pipe size is required" }]}
          >
            <Input placeholder="Enter pipe size" className="h-12 bg-gray-100" />
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
