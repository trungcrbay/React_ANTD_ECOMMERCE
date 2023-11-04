import { Card, Col, Row } from "antd";
import { useEffect } from "react";
import { callFetchListDashboard } from "../../services/api";
import { useState } from "react";
import { CountUp } from "use-count-up";

const AdminPage = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const fetchListDashboard = async () => {
    const res = await callFetchListDashboard();
    setTotalUser(res.data.countUser);
    setTotalOrder(res.data.countOrder);
  };

  useEffect(() => {
    fetchListDashboard();
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Tổng số đơn hàng"
            bordered={false}
            style={{ width: "100%" }}
          >
            <CountUp isCounting end={totalOrder} duration={1.5} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Tổng số tài khoản"
            bordered={false}
            style={{ width: "100%" }}
          >
            <CountUp isCounting end={totalUser} duration={1.5} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPage;
