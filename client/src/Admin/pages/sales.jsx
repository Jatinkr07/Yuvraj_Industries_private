import { useState } from "react";
import { Table, Button, Select, DatePicker, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const { Option } = Select;
const { RangePicker } = DatePicker;

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
    disabled: false,
  },
];

const Sales = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [dealerProduct, setDealerProduct] = useState("");

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
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Button type={text === "In Warranty" ? "primary" : "danger"}>
          {text}
        </Button>
      ),
    },
    {
      title: "Replaced",
      dataIndex: "replaced",
      key: "replaced",
      render: (text, record) => (
        <Button type="primary" disabled={record.disabled}>
          {text}
        </Button>
      ),
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

  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
    filterData(dates, selectedProduct, dealerProduct);
  };

  const handleProductChange = (value) => {
    setSelectedProduct(value);
    filterData(selectedDateRange, value, dealerProduct);
  };

  // eslint-disable-next-line no-unused-vars
  const handleDealerChange = (value) => {
    setDealerProduct(value);
    filterData(selectedDateRange, value);
  };

  const filterData = (dates, product, dealer) => {
    let filtered = data;

    if (dates && dates.length === 2) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= dates[0] && itemDate <= dates[1];
      });
    }

    if (product) {
      filtered = filtered.filter((item) => item.productName === product);
    }
    if (dealer) {
      filtered = filtered.filter((item) => item.dealerName === dealer);
    }

    setFilteredData(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");
    XLSX.writeFile(workbook, "SalesData.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map((col) => col.title)],
      body: filteredData.map((row) => columns.map((col) => row[col.dataIndex])),
    });
    doc.save("SalesData.pdf");
  };

  return (
    <div className="bg-gray-50 min-h-screen overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Sales List</h1>

          <Space>
            <Button type="primary" onClick={exportToExcel}>
              Export to Excel
            </Button>
            <Button type="primary" onClick={exportToPDF}>
              Export to PDF
            </Button>
          </Space>
        </div>
        <RangePicker onChange={handleDateRangeChange} />

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1200, y: 500 }}
          />
        </div>
        <div className="flex gap-8 mb-6 lg:ml-60">
          <Select
            placeholder="Select Product"
            style={{ width: 200 }}
            onChange={handleProductChange}
          >
            {[...new Set(data.map((item) => item.productName))].map(
              (product) => (
                <Option key={product} value={product}>
                  {product}
                </Option>
              )
            )}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Sales;
