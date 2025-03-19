/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Table, Input, Button, Select, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import FormModalSubDealer from "./ModalForm";

import { deleteSubDealer, getSubDealers } from "../../../Services/api";

const SubDealers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subDealers, setSubDealers] = useState([]);
  const [editSubDealerData, setEditSubDealerData] = useState(null);
  const [passwordRequestSubDealer, setPasswordRequestSubDealer] =
    useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedSubDealer, setSelectedSubDealer] = useState(null);

  useEffect(() => {
    fetchSubDealers();
  }, []);

  const fetchSubDealers = async () => {
    try {
      const response = await getSubDealers();
      const formattedData = response.data.map((subDealer, index) => ({
        key: subDealer._id,
        sNo: index + 1,
        name: `${subDealer.firstName} ${subDealer.lastName}`,
        phoneNumber: subDealer.phoneNumber,
        username: subDealer.username,
        firstName: subDealer.firstName,
        lastName: subDealer.lastName,
        password: subDealer.password,
        passwordChangeRequest: subDealer.passwordChangeRequest,
      }));
      setSubDealers(formattedData);
    } catch (error) {
      console.error("Error fetching sub-dealers:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubDealer(id);
      setSubDealers(subDealers.filter((subDealer) => subDealer.key !== id));
    } catch (error) {
      console.error("Error deleting sub-dealer:", error.message);
    }
  };

  const handleEdit = (record) => {
    setEditSubDealerData(record);
    setIsModalOpen(true);
  };

  const handlePasswordRequest = (record) => {
    setPasswordRequestSubDealer(record);
    setIsModalOpen(true);
  };

  const columns = [
    { title: "S. No.", dataIndex: "sNo", key: "sNo", width: 100 },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 180,
    },
    { title: "Username", dataIndex: "username", key: "username", width: 200 },
    {
      title: "Password Status",
      key: "passwordStatus",
      width: 150,
      render: (_, record) => (
        <span
          className={
            record.passwordChangeRequest?.status === "approved"
              ? "text-green-500"
              : "text-gray-500"
          }
        >
          {record.passwordChangeRequest?.status || "None"}
        </span>
      ),
    },
    {
      title: "Products",
      dataIndex: "product",
      key: "product",
      width: 120,
      render: (_, record) => (
        <EyeOutlined
          className="text-blue-600 text-lg cursor-pointer"
          onClick={() => {
            setSelectedSubDealer(record);
            setShowProducts(true);
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-4">
          <EditOutlined
            className="text-blue-600 text-lg cursor-pointer"
            onClick={() => handleEdit(record)}
          />
          {record.passwordChangeRequest?.status === "none" && (
            <LockOutlined
              className="text-yellow-600 text-lg cursor-pointer"
              onClick={() => handlePasswordRequest(record)}
            />
          )}
          <DeleteOutlined
            className="text-red-500 text-lg cursor-pointer"
            onClick={() => handleDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  if (showProducts && selectedSubDealer) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-black font-semibold">
              Products - {selectedSubDealer.name}
            </h1>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => setShowProducts(false)}
              className="text-gray-700 border-gray-400"
            >
              Back to Sub-Dealers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sub-Dealers List</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditSubDealerData(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add New
          </Button>
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
          dataSource={subDealers}
          pagination={true}
          scroll={{ x: 1200, y: 500 }}
        />
      </div>

      <FormModalSubDealer
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPasswordRequestSubDealer(null);
          setEditSubDealerData(null);
        }}
        onSuccess={fetchSubDealers}
        initialData={editSubDealerData || passwordRequestSubDealer}
        isPasswordRequest={!!passwordRequestSubDealer}
        dealerId={passwordRequestSubDealer?.key}
      />
    </div>
  );
};

export default SubDealers;
