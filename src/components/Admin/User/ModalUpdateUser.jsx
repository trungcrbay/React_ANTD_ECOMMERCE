import { AiTwotoneEdit } from "react-icons/ai";
import "../layout.css";
import { useForm } from "antd/es/form/Form";
import { callUpdateUser } from "../../../services/api";
import { Modal, Form, Input,message } from "antd";
import { useState, useEffect } from "react";

const ModalUpdateUser = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { fullName, _id, phone } = values; //send all of it to response
    setIsSubmit(true);
    const res = await callUpdateUser(_id, fullName, phone);
    setIsSubmit(false);
    if (res && res.data) {
      console.log(res);
      message.success("Update user successfully!");
      props.fetchUser();
    } else {
      notification.error({
        message: "Something went wrong",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  console.log(props.dataUpdate)

  useEffect(() => {
    form.setFieldsValue(props.dataUpdate);
  }, [props.dataUpdate]);

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
                Open Modal
            </Button> */}
      <Modal
        title="Update User"
        open={isModalOpen}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setDataUpdate(null);
        }}
      >
        <div style={{ paddingTop: "20px" }}>
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
              hidden
              label="_id"
              name="_id"
              style={{ marginLeft: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Name"
              name="fullName"
              style={{ marginLeft: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              style={{ marginLeft: "10px" }}
            >
              <Input style={{ width: "100%" }} disabled />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              style={{ marginLeft: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Your phone must be number!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ModalUpdateUser;
