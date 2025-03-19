import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { requestSubDealerPasswordChange } from "../../Services/api.js";

export default function ChangePassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await requestSubDealerPasswordChange({
        username: values.username,
        phoneNumber: values.phoneNumber,
      });
      message.success(
        "Password change request submitted. Please contact your dealer for the new password."
      );
      form.resetFields();
      setTimeout(() => navigate("/subdealer/login"), 2000);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message ||
          "Failed to submit password change request"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <img
            src="https://yuvrajindustries.co/wp-content/uploads/2023/03/yuvraj-industries-logo.png"
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
          name="subdealer-change-password"
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
