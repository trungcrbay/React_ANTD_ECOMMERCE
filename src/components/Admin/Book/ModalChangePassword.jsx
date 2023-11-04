import { Button, Form, Input, Modal, message, notification } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { callUpdatePassword } from "../../../services/api";

const ModalChangePassword = (props) => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.account.user);

  const onFinish = async (values) => {
    const { email, oldpass, newpass } = values;
    const res = await callUpdatePassword(email, oldpass, newpass);
    if (res && res.data) {
      message.success("Cập nhật thành công");
      form.resetFields();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);

  return (
    <div>
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 23,
          }}
          style={{
            width: "100%",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            style={{ marginLeft: "10px" }}
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input style={{ width: "100%" }} disabled />
          </Form.Item>

          <Form.Item
            label="Mật khẩu cũ"
            name="oldpass"
            style={{ marginLeft: "10px" }}
            rules={[
              {
                required: true,
                message: "Nhập mật khẩu hiện tại!",
              },
            ]}
          >
            <Input.Password style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newpass"
            style={{ marginLeft: "10px" }}
            rules={[
              {
                required: true,
                message: "Nhập mật khẩu mới!",
              },
            ]}
          >
            <Input.Password style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button style={{marginLeft:'10px'}} htmlType="submit">Cập nhật</Button>
          </Form.Item>
        </Form>
    </div>
  );
};

export default ModalChangePassword;
