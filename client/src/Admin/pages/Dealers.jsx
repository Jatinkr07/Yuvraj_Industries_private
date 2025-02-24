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
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import FormModalSub from "./SubDealerData/FormModalSub";
import SubDealerModal from "./SubDealerData/SubDealerModal";
import ProductsPage from "../DealerLogin/Pages/ProductsPage";
import { deleteDealer, getDealers } from "../../Services/api";

const Dealers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubDealerModalOpen, setIsSubDealerModalOpen] = useState(false);
  const [selectedSubDealer, setSelectedSubDealer] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealers, setDealers] = useState([]);

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
        email: dealer.email,
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
      console.error("Error deleting dealer:", error.response?.data?.message);
    }
  };

  const columns = [
    {
      title: "S. No.",
      dataIndex: "sNo",
      key: "sNo",
      width: 100,
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
      width: 180,
    },
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
      width: 250,
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
            setSelectedDealer(record);
            setShowProducts(true);
          }}
        />
      ),
    },
    {
      title: "SubDealer",
      dataIndex: "SubDealer",
      key: "SubDealer",
      width: 120,
      render: (_, record) => (
        <Link to={`/admin/dealer-products/${record.key}`}>
          <EyeOutlined className="text-blue-600 text-lg cursor-pointer" />
        </Link>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
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

  const data = [
    {
      key: "1",
      sNo: 1,
      name: "John Doe",
      phoneNumber: "+91 9876543210",
      email: "john.doe@example.com",
      product: {
        name: "Sub Dealer 1",
        email: "subdealer1@example.com",
        phoneNumber: "+91 9876543211",
        lastActive: "2023-05-15",
      },
    },
    {
      key: "2",
      sNo: 2,
      name: "Jane Smith",
      phoneNumber: "+91 8765432109",
      email: "jane.smith@example.com",
      product: {
        name: "Sub Dealer 2",
        email: "subdealer2@example.com",
        phoneNumber: "+91 8765432110",
        lastActive: "2023-05-14",
      },
    },
    {
      key: "3",
      sNo: 3,
      name: "David Johnson",
      phoneNumber: "+91 7654321098",
      email: "david.johnson@example.com",
      product: {
        name: "Sub Dealer 3",
        email: "subdealer3@example.com",
        phoneNumber: "+91 7654321099",
        lastActive: "2023-05-13",
      },
    },
  ];

  if (showProducts) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-black font-semibold">
              Products - {selectedDealer?.name}
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
          <ProductsPage />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dealers List</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
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
          dataSource={dealers}
          pagination={true}
          scroll={{ x: 1200, y: 500 }}
        />
      </div>

      <FormModalSub
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={fetchDealers}
      />

      <SubDealerModal
        visible={isSubDealerModalOpen}
        onCancel={() => setIsSubDealerModalOpen(false)}
        product={selectedSubDealer}
      />
    </div>
  );
};

export default Dealers;
