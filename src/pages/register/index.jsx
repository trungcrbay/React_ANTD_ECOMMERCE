import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values; //send all of it to response
    setIsSubmit(true);
    const res = await callRegister(fullName, email, password, phone);

    setIsSubmit(false); //set despite call api success or fail
    //logic goi api thanh cong
    if (res?.data?._id) {
      console.log(res);
      message.success("Create new user successfully!");
      navigate("/login");
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

  return (
    <div className="register">
      <div className="register-form">
        <h1 className="register-heading">Register</h1>
        <div className="form">
          <Form
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
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="fullName"
              style={{ marginLeft: "30px" }}
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
              style={{ marginLeft: "30px" }}
              rules={[
                {
                  required: true,
                  message: "Email must not be empty!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              style={{ marginLeft: "30px" }}
              rules={[
                {
                  required: true,
                  message: "Password at least 6 characters!",
                },
              ]}
            >
              <Input.Password style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              style={{ marginLeft: "30px" }}
              rules={[
                {
                  required: true,
                  message: "Your phone must be number!",
                },
              ]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>

            <Button
              type="primary"
              className="center"
              htmlType="submit"
              loading={isSubmit}
            >
              Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
