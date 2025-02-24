/* eslint-disable react/prop-types */
import { Modal, Form, Input, Button } from "antd";

const ModalForm = ({ visible, onCancel }) => {
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    console.log("formData : ", values);
  };

  return (
    <Modal
      title="Create New Dealer"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter First Name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter Last Name" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter Phone Number" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Email Id"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="Enter Email Id" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter Address" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter Username" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Enter Password" className="h-10" />
          </Form.Item>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            onClick={onCancel}
            className="border border-blue-600 text-blue-600"
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalForm;
