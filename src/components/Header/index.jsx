import React, { useState } from "react";
import {
  Input,
  Avatar,
  Badge,
  Drawer,
  Menu,
  Dropdown,
  Space,
  message,
  Popover,
  Button,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  MailOutlined,
  DownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/font_real.png";
import { FaBars } from "react-icons/fa";
import "../Header/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlide";
import { callLogout } from "../../services/api";
import DarkMode from "../../DarkMode";
import "../../DarkMode.css";
import PopOver from "./PopOver";
import ContentPopOver from "./PopOver";
import { Footer } from "antd/es/layout/layout";
import ModalInfo from "../Admin/Book/ModalInfor";

const Header = (props) => {
  const [open, setOpen] = useState(false);
  const {searchTerm, setSearchTerm} = props;
  console.log(searchTerm)
  const [isOpenModalInfo,setIsOpenModalInfo] = useState(false);
  const user = useSelector((state) => state.account.user);
  const carts = useSelector((state) => state.order.carts); //lay gia tri tu redux
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogOut = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const handleOpenModalUpdateInfor = () => {
    setIsOpenModalInfo(true);
  }

  const items = [
    {
      key: "1",
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => navigate('/')}>
          Trang chủ
        </label>
      )
    },
    {
      key: "2",
      label: (
        <label style={{ cursor: "pointer" }} onClick={handleOpenModalUpdateInfor}>
          Quản lý tài khoản
        </label>
      ),
    },
    {
      key: "3",
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => navigate('/order/history')}>
          Lịch sử mua hàng
        </label>
      ),
    },
    {
      key: "4",
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogOut()}>
          Đăng xuất
        </label>
      ),
    },
  ];

  const onClose = () => {
    setOpen(false);
  };

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  console.log(isAuthenticated);

  const PopOverModal = () => {
    return (
      <div>
        {carts?.map((book, index) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                  book?.detail?.thumbnail
                }`}
                style={{ width: "50px", height: "50px" }}
                alt=""
              />
              <span>{book?.detail?.mainText}</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(book?.detail?.price)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="header">
      {isOpenModalInfo === true && <ModalInfo isOpenModalInfo={isOpenModalInfo} setIsOpenModalInfo={setIsOpenModalInfo}/>}
      <FaBars
        onClick={showDrawer}
        style={{ fontSize: "30px" }}
        className="hide-on-pc bars"
      />
      {/* MOBILE Drawer */}
      <Drawer title="Menu" placement="right" onClose={onClose} open={open}>
        <p onClick={() => navigate('/')} style={{marginTop:'10px',cursor: "pointer"}}>Trang chủ</p>
        <p onClick={handleOpenModalUpdateInfor} style={{marginTop:'10px',cursor: "pointer"}}>Quản lý tài khoản</p>
        <p style={{ cursor: "pointer",marginTop:'10px' }} onClick={() => handleLogOut()}>
          Đăng xuất
        </p>
        <p onClick={() => navigate('/order/history')} style={{marginTop:'10px',cursor: "pointer"}}>Lịch sử mua hàng</p>
      </Drawer>
      <img src={Logo} width={"70px"} className="hide-on-mobile" />
      <Input
        size="large"
        className="size_input"
        placeholder="What are you looking for?"
        prefix={<UserOutlined />}
        value={searchTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}
        width={"50%"}
      />
      <br />
      <Popover
        content={<PopOverModal />}
        title="Sản phẩm mới thêm"
        rootClassName="popover-carts"
        arrow={true}
        overlayStyle={{
          width: "700",
        }}
      >
        <Badge count={carts?.length ?? 0} showZero>
          <Avatar
            size={30}
            style={{ background: "lightblue" }}
            icon={<ShoppingCartOutlined />}
          />
        </Badge>
      </Popover>

      {isAuthenticated === true ? (
        <div>
          <Dropdown
            menu={{
              items,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className="space-admin">
                <span style={{ color: "#000" }}>Welcome I'm Admin</span>
                <DownOutlined style={{ color: "#000" }} />
              </Space>
            </a>
          </Dropdown>
        </div>
      ) : (
        <div className="row hide-on-mobile ">
          <span style={{ cursor: "pointer" }} onClick={() => handleLogin()}>
            Tài khoản
          </span>
        </div>
      )}
    </div>
  );
};

export default Header;
