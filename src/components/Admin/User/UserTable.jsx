import React, { useEffect, useState } from "react";
import { Table, Col, Row, Button, Modal, Form, Input, notification, Popconfirm, message } from 'antd';
import InputSearch from "./InputSearch";
import { callDeleteUser, callFetchListUser } from "../../../services/api";
import { AiFillEye, AiFillDelete, AiOutlineReload, AiOutlineExport, AiOutlineImport, AiTwotoneEdit } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import "../layout.css";
import UserViewDetail from "./UserViewDetail";
import { FaEye } from "react-icons/fa";
import ModalAddNewUser from "./ModalAddNewUser";
import ModalImportFile from "../User/data/ModalImportFile";
import * as XLSX from "xlsx";
import ModalUpdateUser from "./ModalUpdateUser";

const UserTable = () => {
    //luu vao state
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1); //trang hien tai
    const [pageSize, setPageSize] = useState(3); // so luong user moi page
    const [total, setTotal] = useState(0); 
    const [isLoading, setIsLoading] = useState(false);
    const [sortQuery, setSortQuery] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openCreateUser, setOpenCreateUser] = useState(false);
    const [dataView, setDataView] = useState({});
    const [dataUpdate, setDataUpdate] = useState([]);
    const [isUpdateModal, setIsUpdateModal] = useState(false)
    const [filter,setFilter] = useState("");

    const onClose = () => {
        setOpenModal(false);
        setDataView(null);
    };

    const showModalUpdate = () => {
        setIsUpdateModal(true)
    }

    const handlerSearch = (query) => {
        fetchUser(query); //nhan tham so searchFilter 
    }

    const fetchUser = async (searchFilter) => {
        let query = `current=${current}&pageSize=${pageSize}`; //current:1, pageSize: 3
        if (searchFilter) {
            query += `&${searchFilter}`
        }
        if(sortQuery){
            query += `&${sortQuery}`;
        }
        console.log(searchFilter)
        const res = await callFetchListUser(query);
        console.log(res)
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter,sortQuery]) //khi current va pageSize thay doi => goi lai fetchUser !important

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            // sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            // sorter: true,
            
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            // sorter: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            // sorter: true,
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                        <FaEye onClick={() => {
                            setOpenModal(true)
                            setDataView(record)
                            console.log(record); // chua thong tin cua dataview
                        }} className="layoutActionIcon" fillRule="evenodd" />
                        <Popconfirm
                            placement="leftTop"
                            title={"Accept to delete user"}
                            description={"Are you sure?"}
                            onConfirm={() => handleDeleteUser(record._id)}
                            okText="Sure"
                            cancelText="Cancel"
                        >
                            <span>
                                <AiFillDelete className="layoutActionIcon" />
                            </span>
                        </Popconfirm>
                        <AiTwotoneEdit className="layoutActionIcon"
                            onClick={() => {
                                setIsUpdateModal(true)
                                setDataUpdate(record)
                            }} />
                    </div>
                )
            }
        },
    ];


    //sorter va extra k can quan tam
    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
        console.log('params', pagination, filters, sorter, extra);
    };

    const handleExportData = () => {
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "TrungCr7Export.csv");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Table List Users</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button type="primary" className="button-icon" onClick={(() => handleExportData())}>
                        <AiOutlineExport />
                        Export
                    </Button>
                    <ModalImportFile />
                    <ModalAddNewUser fetchUser={fetchUser}/>
                    <AiOutlineReload style={{ fontSize: '18px', cursor: 'pointer' }} 
                    onClick={() => window.location.reload()}
                    />
                </div>
            </div>
        )
    }

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('Delete user successfully');
            fetchUser()
        } else {
            notification.error({
                message: 'Something went wrong',
                description: res.message
            })
        }
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    {openModal === true &&
                        <UserViewDetail
                            dataView={dataView}
                            onClose={onClose}
                            setDataView={setDataView}
                            // setOpenModal={setOpenModal}
                            // openModal={openModal} 
                            />}
                </Col>
                <Col span={24}><InputSearch handlerSearch={handlerSearch} /></Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        columns={columns}
                        style={{ padding: '15px' }}
                        dataSource={listUser}
                        loading={isLoading}
                        onChange={onChange} pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                                showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                                //return ReatNode => return 1 phan tu html
                            }
                        }
                        rowKey="_id"
                    />
                </Col>
            </Row>
            {isUpdateModal === true && 
            <ModalUpdateUser dataUpdate={dataUpdate} setDataUpdate={setDataUpdate} fetchUser={fetchUser}/>}
        </div>
    )
}

export default UserTable;