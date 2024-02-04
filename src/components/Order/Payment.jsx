import {
  Col,
  Row,
  Steps,
  Button,
  Form,
  Input,
  Radio,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./order.css";
import { DeleteOutlined } from "@ant-design/icons";
import {
  doDeleteCartAction,
  doPlaceOrderAction,
} from "../../redux/order/orderSlice";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { callPlaceOrder } from "../../services/api";

const Payment = () => {
  const [form] = Form.useForm();
  const carts = useSelector((state) => state.order.carts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    console.log('Bắt đầu useEffect'); // Thêm log ở đây
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, []);

  console.log(totalPrice);

  const onFinish = async (values) => {
    console.log('Bắt đầu onFinish');
    const detailOrder = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id,
      };
    });
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrder,
    };

    const res = await callPlaceOrder(data);
    console.log('Gọi API callPlaceOrder'); // Thêm log ở đây
    if (res && res.data) {
      message.success("Đặt hàng thành công ! ");
      dispatch(doPlaceOrderAction()); //update cart = 0 after buying
      navigate('/order/success');
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }

  };


  const handleDeleteCart = (value, book) => {
    dispatch(
      doDeleteCartAction({
        _id: book._id,
      })
    );
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div className="order-container">
        <Steps
          style={{ width: "90%" }}
          current={2}
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
        <Row gutter={[20, 20]} style={{marginTop:'20px'}}>
          <Col md={16}>
            {carts?.map((book, index) => {
              const currrentPrice = book?.detail?.price ?? 0;
              return (
                <div className="order-book">
                  <div className="book-content">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        book?.detail?.thumbnail
                      }`} //import.meta.env =>> choc toi file .env de lay vite backend url
                    />

                    <div className="title" style={{ width: "600px" }}>
                      {book?.detail?.mainText}
                    </div>
                    <p className="quantity" style={{ width: "400px" }}>
                      Số lượng: {book?.quantity}
                    </p>
                  </div>
                  <div className="action">
                    <div className="sum">
                      Tổng:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currrentPrice * book?.quantity)}
                    </div>
                    <DeleteOutlined
                      onClick={(value) => handleDeleteCart(value, book)}
                    />
                  </div>
                </div>
              );
            })}
          </Col>
          <Col md={8}>
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              style={{
                maxWidth: 500,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Tên người nhận"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Hình thức thanh toán"
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Radio checked>
                  Thanh toán khi nhận hàng
                </Radio>
              </Form.Item>
              <div>
                <span>Tổng tiền</span>
                <span>
                  {" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  Mua Hàng ({carts?.length ?? 0})
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
