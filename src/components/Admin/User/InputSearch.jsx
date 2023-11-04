import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import '../../../App.css';

const InputSearch = (props) => {
    //form trong ant design gửi dữ liệu trong values là các giá trị: username, passsword,... nếu có các form đó
    const onFinish = (values) => {
        let query = "";
        //build query
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`
        }
        if (values.email) {
            query += `&email=/${values.email}/i`
        }
        if (values.phone) {
            query += `&phone=/${values.phone}/i`
        }
        //truong hop khong dien vao cai gi
        if (query) {
            props.handlerSearch(query);
        }
    }

    return (
        <div style={{ padding: '15px' }}>
            <div style={{ background: '#DCDCDC', padding: '15px', borderRadius: '5px' }}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 24,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Row gutter={25}>
                        <Col span={8}>
                            <Form.Item
                                label="Name"
                                name="fullName"
                                labelCol={{
                                    span: 24,
                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                labelCol={{
                                    span: 24,
                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                labelCol={{
                                    span: 24,
                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                        wrapperCol={{
                            offset: 0,
                            span: 24,
                        }}
                    >
                        <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}
                        
                        >
                            Submit
                        </Button>
                        <Button htmlType="reset" style={{ marginRight: '20px' }}>
                            Clear
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}

export default InputSearch;