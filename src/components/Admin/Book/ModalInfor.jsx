import { AiTwotoneEdit } from "react-icons/ai";
import "../layout.css";
import { useForm } from "antd/es/form/Form";
import { callUpdateUser } from "../../../services/api";
import { Modal, Form, Input, message, Tabs } from "antd";
import { useState, useEffect } from "react";
import ModalUpdateInfo from "./ModalUpdateInfo";
import ModalChangePassword from "./ModalChangePassword";
import { CloseOutlined } from "@ant-design/icons";

const ModalInfo = (props) => {
  const { isOpenModalInfo, setIsOpenModalInfo } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const handleCancel = () => {
    setIsOpenModalInfo(false);
  }
  const items = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: <ModalUpdateInfo />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <ModalChangePassword />,
    },
  ];

  return (
    <div>
      <Modal
        footer={false}
        okText={"Cập nhật"}
        title="Quản lý tài khoản"
        open={isOpenModalInfo}    
        onCancel={handleCancel}  
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </div>
  );
};

export default ModalInfo;
