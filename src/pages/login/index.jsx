import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlide";
import "../../App.css";

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    if (res?.data) {
      console.log(res);
      localStorage.setItem("access_token", res.data.access_token); //truyen gia tri res.data.access_token cho localStorage
      dispatch(doLoginAction(res.data.user)); //dispatch action
      message.success("Login success!");
      navigate("/");
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
    <div className="login">
      <div className="login-form">
        <h1 className="register-heading">Login</h1>
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
              label="Email"
              name="username"
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

            <Button
              type="primary"
              className="center"
              htmlType="submit"
              loading={isSubmit}
            >
              Login
            </Button>
            <div className="form-help">
              <span>Don't have an account?</span>
              <Link to={"/register"}>Register</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
