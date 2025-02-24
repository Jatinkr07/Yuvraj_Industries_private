/* eslint-disable react/prop-types */
import { Modal, Table } from "antd";

const SubDealerModal = ({ visible, onCancel, product }) => {
  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  const data = product
    ? [
        { key: "1", field: "Name", value: product.name },
        { key: "2", field: "Email", value: product.email },
        { key: "3", field: "Phone Number", value: product.phoneNumber },
        { key: "4", field: "Last Active", value: product.lastActive },
      ]
    : [];

  return (
    <Modal
      title="Sub Dealer Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Table columns={columns} dataSource={data} pagination={false} />
    </Modal>
  );
};

export default SubDealerModal;
