import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Services/api";

export default function Settings() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/update-password`,
        {
          oldPassword: values["old-password"],
          newPassword: values["new-password"],
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Password updated successfully");
        setTimeout(() => navigate("/admin/login"), 2000);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update password"
      );
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[30px] shadow-lg p-8 md:p-10">
        <div className="flex justify-center mb-8">
          <img
            src="/logo.jpg"
            alt="Yuvraj Industries Logo"
            width={120}
            height={80}
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-8">
          Change Password
        </h1>

        <Form
          name="dealer-change-password"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-700">Old Password</span>}
            name="old-password"
            rules={[{ required: true, message: "Please enter old password" }]}
            className="mb-6"
          >
            <Input.Password
              placeholder="Please Enter Old Password"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700">New Password</span>}
            name="new-password"
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
            className="mb-2"
          >
            <Input.Password
              placeholder="Please Enter New Password"
              className="h-12 rounded-md bg-gray-50 border-gray-200"
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-center">
            <button className="h-12 custom bg-[#7CB9E8] hover:bg-white text-white hover:text-[#7CB9E8] border border-[#7CB9E8] rounded-md text-base font-medium">
              Update
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
