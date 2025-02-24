import React, { useState } from "react";
import { Table, Input, Button, Select } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";

const Replaced = () => {
  const columns = [
    {
      title: "S. No.",
      dataIndex: "sNo",
      key: "sNo",
      width: 80,
    },
    {
      title: "Product S. No.",
      dataIndex: "productSNo",
      key: "productSNo",
    },
    {
      title: "Replaced By",
      dataIndex: "replacedBy",
      key: "replacedBy",
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      width: 150,
    },
    {
      title: "Dealer Name",
      dataIndex: "dealerName",
      key: "dealerName",
    },
    {
      title: "Warranty Period",
      dataIndex: "warrantyPeriod",
      key: "warrantyPeriod",
    },
    {
      title: "Warranty Left",
      dataIndex: "warrantyLeft",
      key: "warrantyLeft",
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
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
      productSNo: "P-1001",
      productName: "Samsung Galaxy S21",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "ABC Electronics",
      warrantyPeriod: "2 Years",
      warrantyLeft: "1 Year 6 Months",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "2",
      sNo: 2,
      productSNo: "P-1002",
      productName: "Apple iPhone 13",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "XYZ Mobiles",
      warrantyPeriod: "1 Year",
      warrantyLeft: "6 Months",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "3",
      sNo: 3,
      productSNo: "P-1003",
      productName: "Dell Inspiron 15",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Tech World",
      warrantyPeriod: "3 Years",
      warrantyLeft: "2 Years 4 Months",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "4",
      sNo: 4,
      productSNo: "P-1004",
      productName: "Sony Bravia TV",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Home Appliances",
      warrantyPeriod: "2 Years",
      warrantyLeft: "8 Months",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "5",
      sNo: 5,
      productSNo: "P-1005",
      productName: "HP Pavilion x360",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Laptop Hub",
      warrantyPeriod: "1 Year",
      warrantyLeft: "Expired",
      status: "Out of Warranty",
      replaced: "Replace",
      replacedBy: "John Doe",
      disabled: true,
    },
    {
      key: "6",
      sNo: 6,
      productSNo: "P-1006",
      productName: "OnePlus 9 Pro",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Smartphone Plaza",
      warrantyPeriod: "2 Years",
      warrantyLeft: "1 Year",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "7",
      sNo: 7,
      productSNo: "P-1007",
      productName: "Bose Soundbar 700",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Music World",
      warrantyPeriod: "1 Year",
      warrantyLeft: "2 Months",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "8",
      sNo: 8,
      productSNo: "P-1008",
      productName: "Canon EOS R5",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Camera Store",
      warrantyPeriod: "3 Years",
      warrantyLeft: "2 Years",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "9",
      sNo: 9,
      productSNo: "P-1009",
      productName: "LG Refrigerator",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Home Needs",
      warrantyPeriod: "5 Years",
      warrantyLeft: "3 Years 7 Months",
      status: "In Warranty",
      replaced: "Replace",
      replacedBy: "N/A",
      disabled: false,
    },
    {
      key: "10",
      sNo: 10,
      productSNo: "P-1010",
      productName: "Asus ROG Strix",
      barcode: <QrcodeOutlined className="text-2xl" />,
      dealerName: "Gaming World",
      warrantyPeriod: "2 Years",
      warrantyLeft: "Expired",
      status: "Out of Warranty",
      replaced: "Replace",
      replacedBy: "Jane Smith",
      disabled: true,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Replaced List</h1>
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

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200, y: 500 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Replaced;
