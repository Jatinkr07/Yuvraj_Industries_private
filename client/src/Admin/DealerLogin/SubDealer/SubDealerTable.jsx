import { useState } from "react";
import { Table, Input, Select } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ModalForm from "./ModalForm";

const SubDealerTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      title: "S. No.",
      dataIndex: "sNo",
      key: "sNo",
      width: 170,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 230,
    },
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
      width: 320,
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      width: 170,
      render: () => (
        <EyeOutlined className="text-blue-600 text-lg cursor-pointer" />
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 220,
      render: () => (
        <div className="flex gap-4">
          <EditOutlined className="text-blue-600 text-lg cursor-pointer" />
          <DeleteOutlined className="text-red-500 text-lg cursor-pointer" />
        </div>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      sNo: 1,
      name: "John Doe",
      phoneNumber: "+91 9876543210",
      email: "john.doe@example.com",
    },
    {
      key: "2",
      sNo: 2,
      name: "Jane Smith",
      phoneNumber: "+91 8765432109",
      email: "jane.smith@example.com",
    },
    {
      key: "3",
      sNo: 3,
      name: "David Johnson",
      phoneNumber: "+91 7654321098",
      email: "david.johnson@example.com",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sub Dealers List</h1>
          <button
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 bg-[#7CB9E8] text-white hover:text-[#7CB9E8] border border-[#7CB9E8] rounded-md hover:bg-white"
          >
            Add New
          </button>
          <ModalForm
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
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

          <div className="flex-grow">
            <Input
              placeholder="Search"
              suffix={<SearchOutlined />}
              className="max-w-sm"
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={true}
          scroll={{ x: 1200, y: 500 }}
        />
      </div>
    </div>
  );
};

export default SubDealerTable;
