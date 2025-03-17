import { useState, useEffect } from "react";
import { Table, Button, Select, DatePicker, Space, Input, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { API_URL } from "../../Services/api";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [dealerProduct, setDealerProduct] = useState("");
  const [replacementCode, setReplacementCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/sale/v1/sales/all`);
      setSalesData(response.data.sales || []);
      setFilteredData(response.data.sales || []);
    } catch (error) {
      message.error("Failed to fetch sales data", error);
      setSalesData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "S. No.", dataIndex: "sNo", key: "sNo", width: 80 },
    { title: "Product S. No.", dataIndex: "serialNumber", key: "serialNumber" },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      width: 150,
      render: () => <QrcodeOutlined className="text-2xl" />,
    },
    { title: "Dealer Name", dataIndex: "dealerName", key: "dealerName" },
    {
      title: "Sub-Dealer Name",
      dataIndex: "subDealerName",
      key: "subDealerName",
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
      render: (text) =>
        text === "Expired" ? (
          <span className="text-red-500">{text}</span>
        ) : (
          text
        ),
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
        <Button
          type="primary"
          disabled={record.warrantyLeft === "Expired"}
          onClick={() => handleReplace(record)}
        >
          Replace
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

  const handleDealerChange = (value) => {
    setDealerProduct(value);
    filterData(selectedDateRange, selectedProduct, value);
  };

  const filterData = (dates, product, dealer) => {
    let filtered = salesData || [];

    if (dates && dates.length === 2) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.warrantyStartDate);
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

  const calculateWarrantyLeft = (endDate) => {
    const now = new Date();
    const warrantyEnd = new Date(endDate);
    if (warrantyEnd < now) return "Expired";

    const diffMs = warrantyEnd - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    return `${years > 0 ? years + " Year" + (years > 1 ? "s" : "") + " " : ""}${
      months > 0 ? months + " Month" + (months > 1 ? "s" : "") + " " : ""
    }${days > 0 ? days + " Day" + (days > 1 ? "s" : "") : ""}`.trim();
  };

  const handleReplace = async (record) => {
    if (!replacementCode) {
      message.error("Please scan or enter a replacement barcode/serial number");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/sales/replace/${record.saleId}`, {
        code: replacementCode,
      });
      message.success(response.data.message);
      setReplacementCode("");
      fetchSalesData();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to replace product"
      );
    } finally {
      setLoading(false);
    }
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

  const rowClassName = (record) => {
    return record.subDealerName !== "None" && record.soldBy === "subDealer"
      ? "bg-green-100"
      : "";
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

        <Space direction="vertical" size="middle" className="mb-6">
          <RangePicker onChange={handleDateRangeChange} />
          <Select
            placeholder="Select Product"
            style={{ width: 200 }}
            onChange={handleProductChange}
            disabled={loading || !salesData.length}
          >
            {[
              ...new Set((salesData || []).map((item) => item.productName)),
            ].map((product) => (
              <Option key={product} value={product}>
                {product}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Dealer"
            style={{ width: 200 }}
            onChange={handleDealerChange}
            disabled={loading || !salesData.length}
          >
            {[...new Set((salesData || []).map((item) => item.dealerName))]
              .filter(Boolean)
              .map((dealer) => (
                <Option key={dealer} value={dealer}>
                  {dealer}
                </Option>
              ))}
          </Select>
          <Input
            placeholder="Scan or enter replacement barcode/serial number"
            value={replacementCode}
            onChange={(e) => setReplacementCode(e.target.value)}
            prefix={<QrcodeOutlined />}
            style={{ width: 300 }}
          />
        </Space>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={(filteredData || []).map((item, index) => ({
              ...item,
              sNo: index + 1,
              warrantyLeft: calculateWarrantyLeft(item.warrantyEndDate),
              status:
                calculateWarrantyLeft(item.warrantyEndDate) === "Expired"
                  ? "Expired"
                  : "In Warranty",
            }))}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1500, y: 500 }}
            loading={loading}
            rowClassName={rowClassName}
          />
        </div>
      </div>
    </div>
  );
};

export default Sales;
