/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Table, Input, Button, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../Services/api";

const { Option } = Select;

const Replaced = () => {
  const [replacements, setReplacements] = useState([]);
  const [filteredReplacements, setFilteredReplacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("show_all");

  useEffect(() => {
    fetchReplacements();
  }, []);

  const fetchReplacements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/sale/v1/replacements/all`,
        {
          withCredentials: true,
        }
      );
      const data = response.data.replacements || [];
      setReplacements(data);
      filterReplacements(data, searchText, statusFilter);
    } catch (error) {
      console.error("Error fetching replacements:", error);
    } finally {
      setLoading(false);
    }
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

  const filterReplacements = (data, search, status) => {
    let filtered = [...data];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.originalSerialNumber
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.newSerialNumber?.toLowerCase().includes(search.toLowerCase()) ||
          item.originalProductName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.newProductName?.toLowerCase().includes(search.toLowerCase()) ||
          item.dealerName?.toLowerCase().includes(search.toLowerCase()) ||
          item.subDealerName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status === "active") {
      filtered = filtered.filter(
        (item) => calculateWarrantyLeft(item.warrantyEndDate) !== "Expired"
      );
    } else if (status === "inactive") {
      filtered = filtered.filter(
        (item) => calculateWarrantyLeft(item.warrantyEndDate) === "Expired"
      );
    }

    setFilteredReplacements(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterReplacements(replacements, value, statusFilter);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterReplacements(replacements, searchText, value);
  };

  const columns = [
    { title: "S. No.", dataIndex: "sNo", key: "sNo", width: 80 },
    {
      title: "Original S. No.",
      dataIndex: "originalSerialNumber",
      key: "originalSerialNumber",
    },
    {
      title: "Original Product",
      dataIndex: "originalProductName",
      key: "originalProductName",
    },
    {
      title: "Replaced By S. No.",
      dataIndex: "newSerialNumber",
      key: "newSerialNumber",
    },
    {
      title: "New Product",
      dataIndex: "newProductName",
      key: "newProductName",
    },
    {
      title: "New Barcode",
      dataIndex: "newBarcode",
      key: "newBarcode",
      width: 150,
      render: (text) => <QrcodeOutlined className="text-2xl" />,
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
      render: (text) => (
        <span
          className={text === "Expired" ? "text-red-500" : "text-green-500"}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Replaced By",
      dataIndex: "replacedBy",
      key: "replacedBy",
    },
    {
      title: "Replaced Date",
      dataIndex: "replacedDate",
      key: "replacedDate",
      render: (text) => new Date(text).toLocaleDateString(),
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
            onChange={handleStatusChange}
            options={[
              { value: "show_all", label: "Show all" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <div className="flex-grow">
            <Input
              placeholder="Search by serial number, product, or name"
              suffix={<SearchOutlined />}
              className="max-w-sm"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredReplacements.map((item, index) => ({
              ...item,
              sNo: index + 1,
              warrantyLeft: calculateWarrantyLeft(item.warrantyEndDate),
            }))}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1500, y: 500 }}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Replaced;
