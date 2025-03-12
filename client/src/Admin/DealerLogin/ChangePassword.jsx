import { Form, Input, Button, message } from "antd";
import { requestPasswordChange } from "../../Services/api";

export default function ChangePassword() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await requestPasswordChange({
        username: values.username,
        phoneNumber: values.phoneNumber,
      });
      message.success(
        "Password change request submitted. Please contact admin for new password."
      );
      form.resetFields();
    } catch (error) {
      console.log(error);
      message.error("Failed to submit password change request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <img
            src="/logo.jpg"
            alt="Yuvraj Industries Logo"
            width={120}
            height={80}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">
            Password Change Request
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Submit request to reset your password
          </p>
        </div>

        <Form
          form={form}
          name="dealer-change-password"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              placeholder="Enter Username"
              className="h-12 rounded-md border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input
              placeholder="Enter Phone Number"
              className="h-12 rounded-md border-gray-300"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium"
            >
              Request Password Change
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
