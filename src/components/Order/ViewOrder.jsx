import { Col, Divider, Empty, InputNumber, Row, Steps } from "antd";
import "./order.css";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  doUpdateCartAction,
  doDeleteCartAction,
} from "../../redux/order/orderSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Payment from "./Payment";

const ViewOrder = (props) => {
  const carts = useSelector((state) => state.order.carts);
  const dispatch = useDispatch(); 
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  console.log(carts);
  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleOnChangeInput = (value, book) => {
    if (!value || value < 1) return;
    if (!isNaN(value)) {
      dispatch(
        doUpdateCartAction({
          quantity: value,
          detail: book,
          _id: book._id,
        })
      );
    }
  };

  const handleDeleteCart = (value, book) => {
    dispatch(
      doDeleteCartAction({
        _id: book._id,
      })
    );
  };

  const handleNavigatePayment = () => {
    if(carts.length > 0){
       navigate('payment');
    }else return;
  }

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Steps style={{width:'90%'}}
            current={1}
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
          <Col md={16} xs={24}>
            {carts?.map((book, index) => {
              const currrentPrice = book?.detail?.price ?? 0; //lay ra gia tien
              return (
                <div className="order-book">
                  <div className="book-content">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        book?.detail?.thumbnail
                      }`} //import.meta.env =>> choc toi file .env de lay vite backend url
                    />
                    <div className="title">{book?.detail?.mainText}</div>
                  </div>
                  <div className="action">
                    <div className="quantity">
                      <InputNumber
                        value={book?.quantity}
                        size="small"
                        onChange={(value) => handleOnChangeInput(value, book)}
                      />
                    </div>
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
            {carts.length === 0 && (
              <Empty description="Không có ản phẩm trong giỏ hàng" />
            )}
          </Col>
          <Col md={8} xs={24}>
            <div className="order-sum">
              <div className="calculate">
                <span> Tạm tính</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div className="calculate">
                <span> Tổng tiền</span>
                <span className="sum-final">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <button onClick={() => handleNavigatePayment()}>Mua Hàng ({carts?.length ?? 0}) </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ViewOrder;
