import { Form, Input, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { dealerLogin } from "../../Services/api";

export default function DealerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dealer/dashboard";

  const onFinish = async (values) => {
    try {
      const { identifier, password } = values;
      console.log("Attempting login with:", { identifier, password });

      const response = await dealerLogin({ identifier, password });
      console.log("API Response:", response.data);

      console.log("dealerToken should be set by backend");

      const targetPath = from;
      console.log("Navigating to:", targetPath);
      navigate(targetPath, { replace: true });

      setTimeout(() => {
        console.log("Current path after navigation:", window.location.pathname);
      }, 100);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[30px] shadow-lg p-8">
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
          Dealer Login
        </h1>
        <Form name="dealer-login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Username or Phone Number"
            name="identifier"
            rules={[
              {
                required: true,
                message: "Please enter your username or phone number!",
              },
            ]}
          >
            <Input
              placeholder="Enter Username or Phone Number"
              className="h-12 rounded-md"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Enter Password"
              className="h-12 rounded-md"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="h-12 w-full bg-[#4338CA] rounded-md"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
