/* eslint-disable react/prop-types */

import { Modal, Form, Input, Button, Row, Col } from "antd";
import { createDealer } from "../../../Services/api";

const FormModalSub = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await createDealer(values);
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      console.error(
        "Error creating sub-dealer:",
        error.response?.data?.message
      );
    }
  };

  return (
    <Modal
      title="Add New Dealer"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form="myForm">
          Submit
        </Button>,
      ]}
    >
      <Form form={form} name="myForm" layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
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
              rules={[{ required: true }]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email ID"
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password className="h-12" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true }]}
            >
              <Input className="h-12" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default FormModalSub;
