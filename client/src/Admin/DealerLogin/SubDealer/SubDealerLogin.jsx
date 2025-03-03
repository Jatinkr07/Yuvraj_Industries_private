import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../../Services/api";

export default function SubDealerLogin() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/dealer/subdealer/login`,
        values
      );
      Cookies.set("subDealerToken", response.data.token, { expires: 1 / 24 });
      message.success("Login successful");
      navigate("/subdealer/dashboard");
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
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
          Sub-Dealer Login
        </h1>

        <Form
          name="subdealer-login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-700">Username or Phone</span>}
            name="identifier"
            rules={[
              { required: true, message: "Please enter username or phone" },
            ]}
          >
            <Input
              placeholder="Enter Username or Phone"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password
              placeholder="Enter Password"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item className="mb-0 flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="h-12 bg-[#4338CA] hover:bg-[#3730A3] rounded-md text-base font-medium"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
