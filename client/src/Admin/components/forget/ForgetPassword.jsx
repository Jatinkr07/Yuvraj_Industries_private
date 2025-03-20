import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../Services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/forgot-password`,
        {
          email: values.email,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        message.success("Credentials sent to your email");
        setTimeout(() => navigate("/admin/login"), 2000);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to send request");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[30px] shadow-lg p-8 md:p-10">
        <div className="flex justify-center mb-8">
          <img
            src="https://yuvrajindustries.co/wp-content/uploads/2023/03/yuvraj-industries-logo.png"
            alt="Yuvraj Industries Logo"
            width={120}
            height={80}
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-8">
          Forgot Password
        </h1>

        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            className="mb-6"
          >
            <Input
              placeholder="Enter your email"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="h-12 custom bg-[#4338CA] hover:bg-[#3730A3] rounded-md text-base font-medium"
            >
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
