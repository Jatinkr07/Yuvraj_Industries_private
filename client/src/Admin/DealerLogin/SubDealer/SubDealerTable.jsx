/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Table, Input, Select, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ModalForm from "./ModalForm";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../../Services/api";

const SubDealerTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subDealers, setSubDealers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubDealers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/dealer/subdealer/subdealers`,
        {
          withCredentials: true,
        }
      );

      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length === 0) {
        console.log("404 Not Found");
      }
      setSubDealers(
        data.map((dealer, index) => ({
          key: dealer._id || index,
          sNo: index + 1,
          name: `${dealer.firstName || "Unknown"} ${dealer.lastName || ""}`,
          phoneNumber: dealer.phoneNumber || "N/A",
          email: dealer.email || "N/A",
        }))
      );
    } catch (error) {
      message.error(error.message || "Error fetching sub-dealers");
      console.error("Fetch error:", error);
      setSubDealers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubDealers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("dealerToken");
      await axios.delete(`http://localhost:5000/api/dealer/subdealer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Sub-dealer deleted successfully");
      fetchSubDealers();
    } catch (error) {
      message.error("Error deleting sub-dealer");
    }
  };

  const columns = [
    { title: "S. No.", dataIndex: "sNo", key: "sNo", width: 170 },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 230,
    },
    { title: "Email ID", dataIndex: "email", key: "email", width: 320 },
    {
      title: "Actions",
      key: "action",
      width: 220,
      render: (_, record) => (
        <div className="flex gap-4">
          <EditOutlined className="text-blue-600 text-lg cursor-pointer" />
          <DeleteOutlined
            className="text-red-500 text-lg cursor-pointer"
            onClick={() => handleDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sub-Dealers List</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 bg-[#7CB9E8] text-white hover:text-[#7CB9E8] border border-[#7CB9E8] rounded-md hover:bg-white"
          >
            <PlusOutlined /> Add New
          </button>
          <ModalForm
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onSuccess={fetchSubDealers}
          />
        </div>

        <div className="flex gap-4 mb-6">
          <Select
            defaultValue="show_all"
            style={{ width: 120 }}
            options={[
              { value: "show_all", label: "Show all" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <Input
            placeholder="Search"
            suffix={<SearchOutlined />}
            className="max-w-sm"
          />
        </div>

        <Table
          columns={columns}
          dataSource={subDealers}
          loading={loading}
          pagination={true}
          scroll={{ x: 1200, y: 500 }}
        />
      </div>
    </div>
  );
};

export default SubDealerTable;
