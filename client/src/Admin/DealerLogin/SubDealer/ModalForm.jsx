/* eslint-disable react/prop-types */
import { Modal, Form, Input, Button, Row, Col, message } from "antd";
import { useEffect } from "react";
import { createSubDealer, updateSubDealer } from "../../../Services/api";

const FormModalSub = ({ visible, onCancel, onSuccess, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        phoneNumber: initialData.phoneNumber,
        email: initialData.email,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const onFinish = async (values) => {
    try {
      if (initialData) {
        const response = await updateSubDealer(initialData.key, values);
        message.success(response.message || "Sub-dealer updated successfully");
      } else {
        const response = await createSubDealer(values);
        message.success(response.message || "Sub-dealer created successfully");
      }
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      const errorMsg = error.message || "An error occurred";
      message.error(errorMsg);
      console.error("Error processing sub-dealer:", errorMsg);
      if (errorMsg.includes("Unauthorized") || errorMsg.includes("token")) {
        message.error("You need to log in first!");
      }
    }
  };

  return (
    <Modal
      title={initialData ? "Edit Sub-Dealer" : "Add New Sub-Dealer"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form="myForm">
          {initialData ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form form={form} name="myForm" layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email ID"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
        </Row>
        {!initialData && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password className="h-12" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input className="h-12" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default FormModalSub;
