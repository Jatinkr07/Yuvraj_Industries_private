/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import ProductsPage from "../DealerLogin/Pages/ProductsPage";
import { getSubDealersAlls } from "../../Services/api";

const SubDealerTable = ({ dealerId }) => {
  const [subDealers, setSubDealers] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedSubDealer, setSelectedSubDealer] = useState(null);

  useEffect(() => {
    fetchSubDealers();
  }, [dealerId]);

  const fetchSubDealers = async () => {
    try {
      const response = await getSubDealersAlls(dealerId);
      const formattedData = response.map((subDealer, index) => ({
        key: subDealer._id,
        sNo: index + 1,
        name: `${subDealer.firstName} ${subDealer.lastName}`,
        phoneNumber: subDealer.phoneNumber,
        username: subDealer.username,
      }));
      setSubDealers(formattedData);
    } catch (error) {
      console.error("Error fetching sub-dealers:", error);
      setSubDealers([]);
    }
  };

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
      title: "Products",
      key: "products",
      width: 100,
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
  ];

  if (showProducts && selectedSubDealer) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-black font-semibold">
            Sub-Dealer - {selectedSubDealer.name}
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
        <ProductsPage
          dealerId={dealerId}
          subDealerId={selectedSubDealer.key}
          dealerName={selectedSubDealer.name}
          isAdminView={true}
        />
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={subDealers}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 800, y: 400 }}
    />
  );
};

export default SubDealerTable;
