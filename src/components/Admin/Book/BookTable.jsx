import {
  AiFillDelete,
  AiOutlineExport,
  AiOutlineReload,
  AiTwotoneEdit,
} from "react-icons/ai";
import InputSearchBook from "./InputSearchBook";
import {
  Table,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Popconfirm,
  message,
} from "antd";
import { callDeleteBook, callFetchListBook } from "../../../services/api";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import moment from "moment";
import ViewDetailBook from "./ViewDetailBook";
import BookModalCreate from "./BookModalCreate";
import { useCallback } from "react";
import { read, utils, writeFile } from "xlsx";

const BookTable = () => {
  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dataView, setDataView] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const exportFile = useCallback(() => {
    /* generate worksheet from state */
    const ws = utils.json_to_sheet(listBook);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    /* export to XLSX */
    writeFile(wb, "SheetJSReactAoO.xlsx");
  }, [listBook]);


  const onClose = () => {
    setOpenModal(false);
    setDataView(null); //de useEffect chay lai
  };

  const handlerSearch = (query) => {
    fetchBooks(query);
  };

  const fetchBooks = async (searchFilter) => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (searchFilter) {
      query += `&${searchFilter}`;
    }
    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
      console.log(listBook);
    }
    console.log(res.data.result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [current, pageSize]);

  const handleDeleteBook = async (bookId) => {
    const res = await callDeleteBook(bookId);
    console.log(res);
    return;
    if (res && res.data) {
      message.success("Delete successfully"), fetchBooks();
    } else {
      notification.error({
        message: "Something went wrong",
        message: res.message,
      });
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Name",
      dataIndex: "mainText",
    //   sorter: true,
    },
    {
      title: "Type",
      dataIndex: "category",
    //   sorter: true,
    },
    {
      title: "Author",
      dataIndex: "author",
    //   sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
    //   sorter: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    //   sorter: true,
      render: (text) => (
        <span>{moment(text).format("MMMM Do YYYY, h:mm:ss a")}</span>
      ),
    },
    {
      title: "Action",
      render: (text, record, index) => {
        // console.log("text:",text, "record:", record , "index: ", index);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <FaEye
              onClick={() => {
                setOpenModal(true);
                setDataView(record);
              }}
              className="layoutActionIcon"
              fillRule="evenodd"
            />
            <Popconfirm
              placement="leftTop"
              title={"Accept to delete thisbook?"}
              description={"Are you sure?"}
              onConfirm={() => handleDeleteBook(record._id)}
              okText="Sure"
              cancelText="Cancel"
            >
              <span>
                <AiFillDelete className="layoutActionIcon" />
              </span>
            </Popconfirm>
            <AiTwotoneEdit
              className="layoutActionIcon"
              onClick={() => {
                setIsUpdateModal(true);
                setDataUpdate(record);
              }}
            />
          </div>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    console.log("params", pagination, filters, sorter, extra);
  };

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: "bold" }}>Table List Books</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            type="primary"
            className="button-icon"
            onClick={exportFile}
          >
            <AiOutlineExport />
            Export
          </Button>
          <BookModalCreate />
          <AiOutlineReload style={{ fontSize: "18px", cursor: "pointer" }} />
        </div>
      </div>
    );
  };
  return (
    <div>
      <Row>
        <Col span={24}>
          {openModal === true && (
            <ViewDetailBook
              dataView={dataView}
              onClose={onClose}
              setDataView={setDataView}
              setOpenModal={setOpenModal}
              openModal={openModal}
            />
          )}
        </Col>
        <Col span={24}>
          <InputSearchBook handlerSearch={handlerSearch} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            dataSource={listBook}
            columns={columns}
            loading={isLoading}
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {" "}
                    {range[0]}-{range[1]} trên {total} rows
                  </div>
                );
              },
              //return ReatNode => return 1 phan tu html
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BookTable;
