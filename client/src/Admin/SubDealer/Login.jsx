import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";

export default function SubLogin() {
  const onFinish = (values) => {
    console.log("Success:", values);
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
          Sub Dealer Login
        </h1>

        <Form
          name="dealer-login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-700">Username</span>}
            name="username"
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
            className="mb-2"
          >
            <Input.Password
              placeholder="Please Enter Password"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <div className="flex justify-end mb-6">
            <Link
              href="/forgot-password"
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
