/* eslint-disable react/prop-types */
import { Modal, Form, Input, Button, Select } from "antd";
import { useEffect } from "react";
import { createSubDealer, updateSubDealer } from "../../../Services/api";

const FormModalSubDealer = ({
  visible,
  onCancel,
  onSuccess,
  initialData,
  isPasswordRequest,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        phoneNumber: initialData.phoneNumber,
        username: initialData.username, // Add username to edit form
        passwordChangeRequestStatus:
          initialData.passwordChangeRequest?.status || "none",
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      };

      if (initialData) {
        if (values.password) {
          payload.password = values.password;
        }
        payload.passwordChangeRequest = {
          status: values.passwordChangeRequestStatus,
          requestedAt: null, // No "pending", so no requestedAt needed
        };
        await updateSubDealer(initialData.key, payload);
      } else {
        payload.username = values.username;
        payload.password = values.password;
        await createSubDealer(payload);
      }
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Error processing sub-dealer:", error);
    }
  };

  return (
    <Modal
      title={
        initialData
          ? isPasswordRequest
            ? "Handle Password Request"
            : "Edit Sub-Dealer"
          : "Create New Sub-Dealer"
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="Enter First Name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Enter Last Name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter Phone Number" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input
              placeholder="Enter Username"
              className="h-10"
              disabled={!!initialData}
            />
          </Form.Item>
          {!initialData && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter Password" className="h-10" />
            </Form.Item>
          )}
          {initialData && (
            <>
              <Form.Item label="New Password" name="password">
                <Input.Password
                  placeholder="Enter New Password (optional)"
                  className="h-10"
                />
              </Form.Item>
              <Form.Item
                label="Password Change Status"
                name="passwordChangeRequestStatus"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select className="h-10">
                  <Select.Option value="none">None</Select.Option>
                  <Select.Option value="approved">Approved</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            onClick={onCancel}
            className="border border-blue-600 text-blue-600"
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            {initialData ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormModalSubDealer;
