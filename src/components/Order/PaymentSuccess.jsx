import { SmileOutlined } from "@ant-design/icons";
import { Button, Result, Steps } from "antd";

const PaymentSuccess = () => {
  return (
    <div>
      <Steps
        style={{ width: "90%" }}
        current={3}
        items={[
          {
            title: "Đơn hàng",
          },
          {
            title: "Đặt hàng",
          },
          {
            title: "Thanh toán",
          },
        ]}
      />
      <Result
        icon={<SmileOutlined />}
        title="Đơn hàng đã được đặt thành công!"
        extra={<Button type="primary">Xem lịch sử</Button>}
      />
    </div>
  );
};

export default PaymentSuccess;
