import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import '../../../App.css';

const InputSearchBook = (props) => {
    const onFinish = (values) => {
        let query = "";
        //build query
        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`
        }
        if (values.author) {
            query += `&author=/${values.author}/i`
        }
        if (values.category) {
            query += `&category=/${values.category}/i`
        }
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
                    <Row gutter={30}>
                        <Col span={8}>
                            <Form.Item
                                label="Name"
                                name="mainText"
                                labelCol={{
                                    span: 24,
                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Author"
                                name="author"
                                labelCol={{
                                    span: 24,
                                }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Type"
                                name="category"
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
                        <Button htmlType='reset' style={{ marginRight: '20px' }}>
                            Clear
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}

export default InputSearchBook;