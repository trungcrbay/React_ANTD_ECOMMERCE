import { useState, useEffect } from "react";
import {
    Button, Modal, Form, Input, message,
    notification, Row, Col, InputNumber, Upload, Select
} from 'antd';
import { callCreateNewBook, callCreateNewUser, callFetchCategory, callUploadBookImg } from "../../../services/api";
import { GrAdd } from "react-icons/gr";
import "../layout.css";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";



const BookModalCreate = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [listCategory, setListCategory] = useState([]);
    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                console.log(">>check d:", d)
                setListCategory(d);
            }
        }
        fetchCategory()
    }, [])

    const showModal = () => {
        setIsModalOpen(true);
    };
    // const form = Form.useFormInstance();
    const [form] = Form.useForm()

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const onFinish = async (values) => {
        if(dataThumbnail.length === 0){
            notification.error({
                message:'Something went wrong',
                description:'Please upload thumbnail image'
            })
        }

        if(dataSlider.length === 0){
            notification.error({
                message:'Something went wrong',
                description:'Please upload slider image'
            })
        }

        const { mainText,author, price,sold,quantity,category } = values; //send all of it to response
        const thumbnail = dataThumbnail[0].name; //lay ra ten => truyen len backend ten cua hinh anh
        const slider = dataSlider.map(item => item.name); //lay ra ten => truyen len backend ten cua hinh anh
        setIsSubmit(true);
        const res = await callCreateNewBook(thumbnail, slider, mainText, author, price, sold, quantity, category);
        if (res && res.data) {
            console.log(res);
            message.success('Create new book successfully')
            //reset after create successfully
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            setIsModalOpen(false);       
        } else {
            notification.error({
                message: 'Something went wrong',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
            })
        }
        setIsSubmit(false);
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    }

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            //copy previous state => upload multiple images
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    }

    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    return (
        <div>
            <Button type="primary" className="button-icon" onClick={showModal}>
                <GrAdd />
                Add New
            </Button>
            <Modal title="Add New Book" open={isModalOpen} onOk={() => form.submit()} onCancel={handleCancel}>
                <div>
                    <div style={{ paddingTop: '20px' }}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{
                                span: 24,
                            }}
                            wrapperCol={{
                                span: 24
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

                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="Name"
                                        name="mainText"
                                        style={{ marginLeft: '5px' }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your name book!',
                                            },
                                        ]}
                                    >
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Author"
                                        name="author"
                                        style={{ marginLeft: '5px' }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Author must not be empty!',
                                            },
                                        ]}
                                    >
                                        <Input style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={6}>
                                    <Form.Item
                                        label="Price"
                                        name="price"
                                        style={{ marginLeft: '5px' }}
                                    >
                                        <InputNumber addonAfter="VND" defaultValue={100} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Type"
                                        name="category"
                                        style={{ marginLeft: '5px' }}
                                    >
                                        <Select
                                            defaultValue={null}
                                            showSearch
                                            allowClear
                                            style={{
                                                width: 120,
                                            }}
                                            onChange={handleChange}
                                            options={listCategory}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Quantity"
                                        name="quantity"
                                        style={{ marginLeft: '15px' }}
                                    >
                                        <InputNumber min={1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Sold"
                                        name="sold"
                                        style={{ marginLeft: '5px' }}
                                    >
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Thumbnail Image"
                                        name="thumbnail"
                                        style={{ marginLeft: '5px' }}
                                    >
                                        <Upload
                                            name="thumbnail"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileThumbnail}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                            onPreview={handlePreview}
                                        >
                                            <div>
                                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Slider Image"
                                        name="slider"
                                        style={{ marginLeft: '5px' }}
                                    >
                                        <Upload
                                            multiple
                                            name="slider"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            customRequest={handleUploadFileSlider}
                                            beforeUpload={beforeUpload}
                                            onChange={(info) => handleChange(info, 'slider')}
                                            onRemove={(file) => handleRemoveFile(file, "slider")}
                                            onPreview={handlePreview}
                                        >
                                            <div>
                                                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default BookModalCreate;