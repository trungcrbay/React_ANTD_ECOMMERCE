import { Button, Drawer, Badge, Descriptions, Divider, Modal, Upload } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


const ViewDetailBook = (props) => {
    const { dataView } = props
    console.log(props.dataView)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    
    useEffect(()=> {
        if(dataView){
            let imgThumbnail = {} , imgSLider = [];
            if(dataView.thumbnail){
                imgThumbnail = {
                    // uuid:uuidv4(),
                    uid:uuidv4(),
                    name:dataView.thumbnail,
                    status:'done',
                    url:`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataView.thumbnail}`,
                }
            }
            if(dataView.slider && dataView.slider.length > 0){
                dataView.slider.map(item => {
                    imgSLider.push({
                        uid:uuidv4(),
                        name:item,
                        status:'done',
                        url:`${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }

            setFileList([imgThumbnail, ...imgSLider])
            //copy imgSlider 
        }
    },[dataView])
    
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
    
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);


    const items = [
        {
            key: '1',
            label: 'Product',
            children: 'Cloud Database',
            span: 2
        },
        {
            key: '2',
            label: 'Billing Mode',
            children: 'Prepaid',
            span: 2
        },
        {
            key: '3',
            label: 'Automatic Renewal',
            children: 'YES',
            span: 2
        },
        {
            key: '4',
            label: 'Order time',
            children: '2018-04-24 18:00:00',
            span: 2
        },
        {
            key: '5',
            label: 'Status',
            children: <Badge status="processing" text="Running" />,
            span: 3,
        },
        {
            key: '7',
            label: 'Negotiated Amount',
            children: '$80.00',
        },
        {
            key: '8',
            label: 'Discount',
            children: '$20.00',
        },


    ];

    return (
        <div>
            <Drawer title="Detail Book Information" width={"120vh"} placement="right" onClose={props.onClose} open={open}>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Id">{dataView._id}</Descriptions.Item>
                    <Descriptions.Item label="Name Book">{dataView.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author">{dataView.author}</Descriptions.Item>
                    <Descriptions.Item label="Price">{dataView.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Type">
                        <Badge status="processing" text={dataView.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Create At">
                        {moment(dataView.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Update At">
                        {moment(dataView.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left">Book Images</Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList= {
                        {showRemoveIcon:false}
                    }
                >

                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={previewImage}
                    />
                </Modal>
            </Drawer>

        </div>
    )
}

export default ViewDetailBook;