import { Table } from "antd";
import { useEffect, useState } from "react";
import { callFetchListOrder } from "../../../services/api";

const OrderTable = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [listOrder, setListOrder] = useState([]);
  const [total,setTotal] = useState(0);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "createdAt",
    },
  ];

  const onChange = (pagination, filters) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    console.log("params", pagination, filters);
  };

  const fetchListOrder = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;
    const res = await callFetchListOrder(query);
    console.log(res);
    if (res && res.data) {
      setListOrder(res.data.result);
      setTotal(res.data.meta.total)
    }
  };

  useEffect(() => {
    fetchListOrder();
  }, [pageSize,current]);
  return (
    <div style={{ padding: "20px" }}>
      <Table
        columns={columns}
        dataSource={listOrder}
        onChange={onChange}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
          //return ReatNode => return 1 phan tu html
        }}
        title={() => (
          <span style={{ fontWeight: "bold" }}>Table list order</span>
        )}
      />
    </div>
  );
};

export default OrderTable;
