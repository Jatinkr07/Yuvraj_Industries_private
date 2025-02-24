/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Table, Button } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import ProductsPage from "../../SubDealer/Pages/ProductsPage";

const DealerProducts = () => {
  const router = useNavigate();
  const { id } = useParams();
  const [showProducts, setShowProducts] = useState(false);
  const [selectedSubDealer, setSelectedSubDealer] = useState(null);

  const columns = [
    {
      title: "S. No.",
      dataIndex: "sNo",
      key: "sNo",
      width: 190,
    },
    {
      title: "Sub Dealer Name",
      dataIndex: "subdealername",
      key: "subdealername",
    },
    {
      title: "Added On",
      dataIndex: "add",
      key: "add",
    },
    {
      title: "Products",
      dataIndex: "product",
      key: "product",
      width: 220,
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
      title: "Warranty",
      dataIndex: "warranty",
      key: "warranty",
      width: 180,
    },
  ];

  const data = [
    {
      key: "1",
      sNo: 1,
      subdealername: "Mukesh",
      name: "Product A",
      code: "12345678",
      add: "2024-11-15",
      manufactureDate: "2023-01-15",
      warranty: "1 year",
    },
    {
      key: "2",
      sNo: 2,
      subdealername: "Ravi",
      name: "Product B",
      code: "12345678",
      add: "2024-11-15",
      manufactureDate: "2023-02-20",
      warranty: "2 years",
    },
    {
      key: "3",
      sNo: 3,
      subdealername: "Marco",
      name: "Product C",
      code: "12345678",
      add: "2024-11-15",
      manufactureDate: "2023-03-10",
      warranty: "6 months",
    },
  ];

  if (showProducts) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Products - {selectedSubDealer?.subdealername}
            </h1>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => setShowProducts(false)}
              className="text-gray-700 border-gray-400"
            >
              Back to Sub Dealer Products
            </Button>
          </div>
          <ProductsPage />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sub Dealer Products</h1>
          <Link to="/admin/dealers">
            <Button>Back to Dealers</Button>
          </Link>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={true}
          scroll={{ x: 800, y: 500 }}
        />
      </div>
    </div>
  );
};

export default DealerProducts;
