/* eslint-disable react/prop-types */
import { Table, Tag, Button } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "S. No.",
    dataIndex: "serial",
    render: (text) => <span className="text-blue-600 font-medium">{text}</span>,
  },
  {
    title: "Product Name",
    dataIndex: "product",
  },
  {
    title: "Bar Code",
    dataIndex: "barcode",
    render: () => <QrcodeOutlined className="text-2xl" />, // QR Code icon
  },
  {
    title: "Dealer name",
    dataIndex: "dealer",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) => (
      <Tag
        className="px-4 py-1 text-sm font-medium rounded-md"
        color={status === "In Warranty" ? "green" : "red"}
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    render: () => (
      <Button type="primary" className="bg-blue-600 text-white rounded-md">
        Replace
      </Button>
    ),
  },
];

const SalesTable = ({ data }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Sales</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered={false}
      />
    </div>
  );
};

export default SalesTable;
