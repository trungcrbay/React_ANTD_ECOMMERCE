import { useState } from "react";
import { Button, Modal, message, Upload, Space, Table, Tag, notification } from 'antd';
import { AiOutlineImport } from "react-icons/ai";
import { InboxOutlined } from "@ant-design/icons";
const { Dragger } = Upload;
import * as XLSX from "xlsx";
import { callBulkCreateUser } from "../../../../services/api";
import templateFile from './template.xlsx?url';
//?url: nhan biet do la mot url, ko phai la 1 file anh

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess('ok');
    }, 3000)
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },

];

const ModalImportFile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [dataExcel,setDataExcel] = useState([]);

    const props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: dummyRequest,
        onChange(info) {
            console.log("Infor:", info)
            const { status } = info.file;
            console.log(status); //uploading or done 
            if (status !== 'uploading') {
                console.log("Infor file: " ,info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    console.log(file);
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        let data = new Uint8Array(e.target.result);
                        let workbook = XLSX.read(data, { type: 'array' });
                        // find the name of your sheet in the workbook first
                        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
                        // convert to json format
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                            header:["fullName","email","phone"], //nhung thuoc tinh can lay ra trong file excel
                            range:1 // skip header row
                        });
                        console.log('check json', jsonData)
                        if( jsonData && jsonData.length > 0) setDataExcel(jsonData)
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = async() => {
        const data = dataExcel.map(item => {
            item.password = '123456';
            return item;
        })
        const res = await callBulkCreateUser(data)
        console.log(data)
        if(res.data){
            notification.success({
                description:`Success: ${res.data.countSuccess}, Error:${res.data.countError}`,
                message:'Uploaded Successfully'
            })
            setDataExcel([]);
            setIsModalOpen(false);
            props.fetchUser()
        }else{
            notification.error({
                description:res.message,
                message:'Something went wrong'
            })
        }
    }

    return (
        <div>
            <Button type="primary" onClick={showModal} className="button-icon" >
                <AiOutlineImport />
                Import
            </Button>
            <Modal title="Import Data User" open={isModalOpen}
            okButtonProps={{disabled: dataExcel.length < 1 }} maskClosable={false} //bam ra ngoai modal k dong
            okText= "Import Data"
            onOk={handleSubmit} 
            onCancel={() => {
                setIsModalOpen(false);
                setDataExcel([]);//cancel data file excel
            }
            }>
                <Dragger {...props} style={{ marginBottom: '15px' }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. <a onClick={e=> e.stopPropagation()} href={templateFile} download>Download Sample File</a>
                        {/** ngan chan su kien noi bot: stopPropagation()*/}
                    </p>
                </Dragger>
                <span style={{ padding: '15px', fontSize: '16px' }}>Dữ liệu upload</span>
                <Table dataSource={dataExcel} columns={columns} style={{ marginTop: '15px' }} />
            </Modal>
        </div>
    )
}

export default ModalImportFile;