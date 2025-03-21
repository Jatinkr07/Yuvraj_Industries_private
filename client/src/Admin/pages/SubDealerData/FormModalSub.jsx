/* eslint-disable react/prop-types */
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { createDealer, updateDealer } from "../../../Services/api";
import { useEffect } from "react";

const FormModalSub = ({
  visible,
  onCancel,
  onSuccess,
  initialData,
  isPasswordRequest = false,
  dealerId,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        phoneNumber: initialData.phoneNumber,
        username: initialData.username,

        password:
          initialData.passwordChangeRequest?.status === "pending"
            ? undefined
            : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const onFinish = async (values) => {
    try {
      console.log("Form values being sent:", values);
      if (initialData && !isPasswordRequest) {
        await updateDealer(initialData.key, values);
      } else if (isPasswordRequest) {
        await updateDealer(dealerId, {
          ...values,
          passwordChangeRequest: { status: "approved" },
        });
      } else {
        await createDealer(values);
      }
      console.log("Dealer update/create successful");
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      console.error(
        "Error processing dealer:",
        error.response?.data?.message || error.message
      );
    }
  };

  const isPasswordEditable =
    isPasswordRequest ||
    initialData?.passwordChangeRequest?.status === "pending";

  return (
    <Modal
      title={
        isPasswordRequest
          ? "Update Dealer Password"
          : initialData
          ? "Edit Dealer"
          : "Add New Dealer"
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form="myForm">
          {isPasswordRequest
            ? "Update Password"
            : initialData
            ? "Update"
            : "Submit"}
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
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input
                className="h-12"
                disabled={isPasswordRequest || initialData}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                className="h-12"
                disabled={!isPasswordEditable && initialData}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default FormModalSub;
