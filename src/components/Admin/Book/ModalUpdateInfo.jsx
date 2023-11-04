import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, Row, Upload } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { callUpdateUserInfo } from "../../../services/api";

const ModalUpdateInfo = () => {
  const [form] = Form.useForm();
  const user = useSelector(state=> state.account.user);

  // const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${tempAvatar || user?.avatar}`;

  const fileProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onFinish = async (values) => {
    const { fullName, phone, _id } = values;
    const res = await callUpdateUserInfo(fullName, phone , _id );
    console.log(res);
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
    <div style={{ paddingTop: "20px" }}>
      <Row>
        <Col span={10}>
          <Avatar size={{xs:32,sm:64,md:80,lg:120,xl:160}} icon={<UserOutlined />} />
          <div style={{ marginTop: "30px" }}>
            <Upload {...fileProps}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
        </Col>
        <Col span={14}>
          <Form
            form={form}
            name="update"
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
              label="Id"
              name="_id"
              hidden
              style={{ marginLeft: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Your id",
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
            <Form.Item>
                <Button style={{marginLeft:'10px'}} htmlType="submit">Cập nhật</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ModalUpdateInfo;
