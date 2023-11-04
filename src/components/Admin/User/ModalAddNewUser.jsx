import { useState } from "react";
import { Button, Modal, Form, Input, message, notification } from 'antd';
import { useNavigate } from "react-router-dom";
import { callCreateNewUser } from "../../../services/api";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { useForm } from "antd/es/form/Form";
import { GrAdd } from "react-icons/gr";
import "../layout.css";

const ModalAddNewUser = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const showModal = () => {
        setIsModalOpen(true);
    };
    // const form = Form.useFormInstance();
    const [form] = Form.useForm()

    // const handleOk = () => {
    //     setIsModalOpen(false);
    // };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        const { fullName, email, password, phone } = values; //send all of it to response
        setIsSubmit(true);
        const res = await callCreateNewUser(fullName, email, password, phone);

        setIsSubmit(false); //set despite call api success or fail
        if (res?.data?._id) {
            console.log(res);
            message.success('Create new user successfully!');
            form.resetFields();
            props.fetchUser();
        } else {
            notification.error({
                message: 'Something went wrong',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }


    };

    return (
        <div>
            <Button type="primary" className="button-icon"  onClick={showModal}>
                <GrAdd />
                Add New
            </Button>
            <Modal title="Create New User" open={isModalOpen} onOk={() => form.submit()} onCancel={handleCancel}>
                <div>
                    <div style={{ paddingTop: '20px' }}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{
                                span: 24,
                            }}
                            wrapperCol={{
                                span: 23
                            }}
                            style={{
                                width: '100%',

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
                                style={{ marginLeft: '10px' }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                style={{ marginLeft: '10px' }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email must not be empty!',
                                    },
                                ]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                style={{ marginLeft: '10px' }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Password at least 6 characters!',
                                    },
                                ]}
                            >
                                <Input.Password style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                                style={{ marginLeft: '10px' }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Your phone must be number!',
                                    },
                                ]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>

                        </Form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalAddNewUser;