import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Col, Divider, Rate, Row ,message  } from "antd";
import { MinusOutlined , PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from 'react-icons/bs';
import './book.css';
import BookLoader from "./BookLoader";

import { useDispatch } from "react-redux";
import { useState } from "react";
import { doAddBookAction } from "../../redux/order/orderSlice";
import { useNavigate } from "react-router-dom";

const ViewDetail = (props) => {
  const dispatch = useDispatch();
  const {dataBook} = props;
  console.log(dataBook);
  const [currentQuantity , setCurrentQuantity] = useState(1); 
  const images = dataBook?.items ?? [];
  const navigate = useNavigate();
  
  const handleChangeButton = (type) => {
    if(type === 'MINUS'){
      if(currentQuantity <= 1){
        return;
      }
      setCurrentQuantity(currentQuantity - 1);
    }
    if(type ==='PLUS'){
      if(currentQuantity === +dataBook.quantity){
        return;
      }
      setCurrentQuantity(currentQuantity + 1);
    }
  }

  const handleChangeInput = (value) => {
    if(!isNaN(value)){
      if(+value > 0 && +value < +dataBook.quantity){
        setCurrentQuantity(+value);
      }
    }
  }

  const handleAddToCart = (quantity , book) => {
    dispatch(doAddBookAction({
      quantity, detail:book, _id: book._id
    })) //nem du lieu nay sang con redux
    message.success('Sản phẩm đã được thêm vào giỏ hàng!')
  }

  return (
    <div className="view-detail-book">
      {dataBook ?
      <Row gutter={24}>
      <Col md={12} xs={24}>
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
          slideOnThumbnailOver={true}
          renderLeftNav={() => <></>}
          renderRightNav={() => <></>}
        />
      </Col>
      <Col md={12} xs={24}>
        <div className="author">
          Tác giả: <a href="#">{dataBook?.author}</a>{" "}
        </div>
        <div className="title">
        {dataBook?.mainText}
        </div>
        <div className="rating">
          <Rate
            value={5}
            disabled
            style={{ color: "#ffce3d", fontSize: 12 }}
          />
          <span className="sold">
            <Divider type="vertical" />
            Đã bán {dataBook?.sold}
          </span>
        </div>
        <div className="price">
          <span className="currency">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(dataBook.price)}
          </span>
        </div>
        <div className="delivery">
          <div>
            <span className="left">Vận chuyển</span>
            <span className="right">Miễn phí vận chuyển</span>
          </div>
        </div>
        <div className="quantity">
          <span className="left">Số lượng</span>
          <span className="right">
            <button>
              <MinusOutlined onClick={() => handleChangeButton('MINUS')}/>
            </button>
            <input defaultValue={1} onChange={(e) => handleChangeInput(e.target.value)} value={currentQuantity}/>
            <button> 
              <PlusOutlined onClick={() => handleChangeButton('PLUS')}/>
            </button>
          </span>
        </div>
        <div className="buy">
          <button className="cart" onClick={() => handleAddToCart(currentQuantity,dataBook)}>
            <BsCartPlus className="icon-cart" />
            <span>Thêm vào giỏ hàng</span>
          </button>
          <button className="now" onClick={() => navigate('/order')}>Mua ngay</button>
        </div>
      </Col>
    </Row>
      : <BookLoader/>}

    </div>
  );
};

export default ViewDetail;
