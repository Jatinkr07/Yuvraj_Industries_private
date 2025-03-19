import { Form, Input, Button, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "../../../Services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";
  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, values);
      if (response.status === 200) {
        Cookies.set("adminAuth", "authenticated", {
          secure: true,
          sameSite: "strict",
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      message.error("Invalid credentials");
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

        <h1 className="text-2xl font-semibold text-center mb-8">Admin Login</h1>

        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-700">Username</span>}
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
            className="mb-6"
          >
            <Input
              placeholder="Please Enter Username"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
            className="mb-2"
          >
            <Input.Password
              placeholder="Please Enter Password"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <div className="flex justify-end mb-6">
            <Link
              to="/admin/forgot-password"
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item className="mb-0 flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="h-12 custom bg-[#4338CA] hover:bg-[#3730A3] rounded-md text-base font-medium"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
