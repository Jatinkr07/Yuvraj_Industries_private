/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Table, Input, Button, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  LockOutlined,
} from "@ant-design/icons";
import FormModalSub from "./SubDealerData/FormModalSub";
import ProductsPage from "../DealerLogin/Pages/ProductsPage";
import { deleteDealer, getDealers } from "../../Services/api";
import SubDealerTable from "./SubDealerTable";

const Dealers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [showSubDealers, setShowSubDealers] = useState(false);
  const [dealers, setDealers] = useState([]);
  const [editDealerData, setEditDealerData] = useState(null);
  const [passwordRequestDealer, setPasswordRequestDealer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const response = await getDealers();
      const formattedData = response.data.map((dealer, index) => ({
        key: dealer._id,
        sNo: index + 1,
        name: `${dealer.firstName} ${dealer.lastName}`,
        phoneNumber: dealer.phoneNumber,
        username: dealer.username,
        firstName: dealer.firstName,
        lastName: dealer.lastName,
        password: dealer.password,
        passwordChangeRequest: dealer.passwordChangeRequest,
      }));
      setDealers(formattedData);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDealer(id);
      setDealers(dealers.filter((dealer) => dealer.key !== id));
    } catch (error) {
      console.error("Error deleting dealer:", error.message);
    }
  };

  const handleEdit = (record) => {
    setEditDealerData(record);
    setIsModalOpen(true);
  };

  const handlePasswordRequest = (record) => {
    setPasswordRequestDealer(record);
    setIsModalOpen(true);
  };

  const filteredDealers = dealers.filter(
    (dealer) =>
      dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dealer.phoneNumber.includes(searchTerm) ||
      dealer.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "S. No.", dataIndex: "sNo", key: "sNo", width: 80 },
    { title: "Name", dataIndex: "name", key: "name", width: 200 },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
    },
    {
      title: "Password Status",
      key: "passwordStatus",
      width: 150,
      render: (_, record) => (
        <span
          className={
            record.passwordChangeRequest?.status === "pending"
              ? "animate-pulse text-red-500"
              : ""
          }
        >
          {record.passwordChangeRequest?.status || "None"}
        </span>
      ),
    },
    {
      title: "Products",
      key: "products",
      width: 100,
      render: (_, record) => (
        <EyeOutlined
          className="text-blue-600 text-lg cursor-pointer"
          onClick={() => {
            setSelectedDealer(record);
            setShowProducts(true);
            setShowSubDealers(false);
          }}
        />
      ),
    },
    {
      title: "Sub-Dealers",
      key: "subDealers",
      width: 100,
      render: (_, record) => (
        <EyeOutlined
          className="text-green-600 text-lg cursor-pointer"
          onClick={() => {
            setSelectedDealer(record);
            setShowSubDealers(true);
            setShowProducts(false);
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
          {record.passwordChangeRequest?.status === "pending" && (
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

  if (showProducts && selectedDealer) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-black font-semibold">
              Products - {selectedDealer.name}
            </h1>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => setShowProducts(false)}
              className="text-gray-700 border-gray-400"
            >
              Back to Dealers
            </Button>
          </div>
          <ProductsPage
            dealerId={selectedDealer.key}
            dealerName={selectedDealer.name}
            isAdminView={true}
          />
        </div>
      </div>
    );
  }

  if (showSubDealers && selectedDealer) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-black font-semibold">
              Dealer - {selectedDealer.name}
            </h1>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => setShowSubDealers(false)}
              className="text-gray-700 border-gray-400"
            >
              Back to Dealers
            </Button>
          </div>
          <SubDealerTable dealerId={selectedDealer.key} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dealers List</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditDealerData(null);
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
          <Input
            placeholder="Search dealers"
            prefix={<SearchOutlined />}
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredDealers}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000, y: 500 }}
        />
      </div>

      <FormModalSub
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setPasswordRequestDealer(null);
          setEditDealerData(null);
        }}
        onSuccess={fetchDealers}
        initialData={editDealerData || passwordRequestDealer}
        isPasswordRequest={!!passwordRequestDealer}
        dealerId={passwordRequestDealer?.key}
      />
    </div>
  );
};

export default Dealers;
