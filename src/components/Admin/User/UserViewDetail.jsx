import { Button, Drawer, Badge, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';

const UserViewDetail = (props) => {
    const { dataView } = props

    return (
        <div>
            <Drawer title="Detail User Information" width={"120vh"} placement="right" onClose={props.onClose} open={open}>

                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Id">{dataView ._id}</Descriptions.Item>
                    <Descriptions.Item label="Full Name">{dataView.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataView.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{dataView.phone}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Status">
                        <Badge status="processing" text="Running" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Create At">
                        {moment(dataView.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Update At">
                        {moment(dataView.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </Descriptions.Item>
                </Descriptions>


            </Drawer>
        </div>
    )
}

export default UserViewDetail;