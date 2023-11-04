import { Space, Table, Tag } from "antd";
import {
  callFetchListOrder,
  callFetchListOrderHistory,
} from "../../services/api";
import { useState } from "react";
import { useEffect } from "react";
import ReactJson from "react-json-view";

const PaymentHistory = () => {
  const [listOrder, setListOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
    },
    {
      title: "Tổng số tiền",
      render: (record) => (
        <>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(record.totalPrice)}
        </>
      ),
    },
    {
      title: "Trạng thái",
      render: () => (
        <>
          <Tag color="#87d068">Thành công</Tag>
        </>
      ),
    },
    {
      title: "Chi tiết",
      render: (record) => (
        <ReactJson
          collapseStringsAfterLength="false"
          collapsed="true"
          name="Chi tiết đơn hàng"
          src={record.detail}
         
        />
      ),
    },
  ];

  const fetchOrders = async () => {
    const res = await callFetchListOrderHistory();
    if (res && res.data) {
      setListOrder(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Table columns={columns} dataSource={listOrder} loading={isLoading} />
    </div>
  );
};

export default PaymentHistory;
