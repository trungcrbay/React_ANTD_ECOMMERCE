import {
  Col,
  Divider,
  Drawer,
  Empty,
  InputNumber,
  Pagination,
  Row,
  Spin,
} from "antd";
import { AiFillFilter, AiOutlineFilter, AiOutlineReload } from "react-icons/ai";
import { Checkbox, Input, Button, Rate, Tabs, Form } from "antd";
import "./home.css";
import { useEffect, useState } from "react";
import { callFetchCategory, callFetchListBook } from "../../services/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";

const Home = () => {
  const [listBook, setListBook] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-sold");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useOutletContext();
  const [isShowListFilter, setIsShowListFilter] = useState(false);
  const [form] = Form.useForm();

  const items = [
    {
      key: "sort=-sold",
      label: "Phổ biến",
      children: "",
    },
    {
      key: "sort=-updatedAt",
      label: "Hàng mới",
      children: "",
    },
    {
      key: "sort=price",
      label: "Giá thấp đến cao",
      children: "",
    },
    {
      key: "sort=-price",
      label: "Giá cao đến thấp",
      children: "",
    },
  ];

  //convert tieng viet ->> khong dau
  const nonAccentVietnamese = (str) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");

    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    // Loại bỏ các ký tự đặc biệt
    // str = str.replace(/[^a-zA-Z0-9 \s]/g, "")

    return str;
  };

  var converSlug = function (str) {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  const handleRedirectBook = (book) => {
    const slug = converSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };

  const handleOnChangePage = (pagination) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    if (searchTerm) {
      query += `&mainText=/${searchTerm}/i`;
    }
    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const fetchListCategory = async () => {
    const res = await callFetchCategory();
    if (res && res.data) {
      const d = res.data.map((item) => {
        return { label: item, value: item };
      });
      setListCategory(d);
    }
  };

  useEffect(() => {
    fetchListCategory();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [current, pageSize, filter, sortQuery, searchTerm]);

  const handleChangeFilter = (changedValues, values) => {
    console.log(">>check handleChangeFilter: ", changedValues, values);
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };

  const onFinish = (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
    console.log(">>check values: ", values);
  };

  const handleClickFilter = (prevState) => {
    setIsShowListFilter((prevState) => !prevState);
  };

  const onClose = () => {
    setIsShowListFilter(false);
  };

  return (
    <div className="home">
      <Row>
        <Col md={4} sm={0} xs={0}>
          <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {" "}
                <FilterTwoTone />
                <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
              </span>
              <ReloadOutlined
                title="Reset"
                onClick={() => {
                  form.resetFields();
                  setFilter("");
                }}
              />
            </div>
            <Divider />
            <Form
              onFinish={onFinish}
              form={form}
              onValuesChange={(changedValues, values) =>
                handleChangeFilter(changedValues, values)
              }
            >
              <Form.Item
                name="category"
                label="Danh mục sản phẩm"
                labelCol={{ span: 24 }}
              >
                <Checkbox.Group>
                  <Row>
                    {listCategory?.map((item, index) => {
                      return (
                        <Col
                          span={24}
                          key={`index-${index}`}
                          style={{ padding: "7px 0" }}
                        >
                          <Checkbox value={item.value}>{item.label}</Checkbox>
                        </Col>
                      );
                    })}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Divider />
              <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                <Row gutter={[10, 10]} style={{ width: "100%" }}>
                  <Col xl={11} md={24}>
                    <Form.Item name={["range", "from"]}>
                      <InputNumber
                        name="from"
                        min={0}
                        placeholder="đ TỪ"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={2} md={0}>
                    <div> - </div>
                  </Col>
                  <Col xl={11} md={24}>
                    <Form.Item name={["range", "to"]}>
                      <InputNumber
                        name="to"
                        min={0}
                        placeholder="đ ĐẾN"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <div>
                  <Button
                    onClick={() => form.submit()}
                    style={{ width: "100%" }}
                    type="primary"
                  >
                    Áp dụng
                  </Button>
                </div>
              </Form.Item>
              <Divider />
              <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                <div>
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 15 }}
                  />
                  <span className="ant-rate-text"></span>
                </div>
                <div>
                  <Rate
                    value={4}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 15 }}
                  />
                  <span className="ant-rate-text">trở lên</span>
                </div>
                <div>
                  <Rate
                    value={3}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 15 }}
                  />
                  <span className="ant-rate-text">trở lên</span>
                </div>
                <div>
                  <Rate
                    value={2}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 15 }}
                  />
                  <span className="ant-rate-text">trở lên</span>
                </div>
                <div>
                  <Rate
                    value={1}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 15 }}
                  />
                  <span className="ant-rate-text">trở lên</span>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col md={20} xs={24}>
          <Spin spinning={isLoading} tip="Loading...">
            <div className="home-product">
              <div className="product">
                <Tabs
                  className="tab"
                  defaultActiveKey="sort=-sold"
                  items={items}
                  onChange={(value) => setSortQuery(value)}
                />
              </div>
              <div className="res-filter">
                <div
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <AiFillFilter onClick={handleClickFilter} />
                  <span>Lọc</span>
                </div>
                {isShowListFilter === true ? (
                  <Drawer
                    title="Lọc sản phẩm"
                    placement="right"
                    onClose={onClose}
                    open={isShowListFilter}
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 5,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          {" "}
                          <FilterTwoTone />
                          <span style={{ fontWeight: 500 }}>
                            {" "}
                            Bộ lọc tìm kiếm
                          </span>
                        </span>
                        <ReloadOutlined
                          title="Reset"
                          onClick={() => {
                            form.resetFields();
                            setFilter("");
                          }}
                        />
                      </div>
                      <Divider />
                      <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues, values) =>
                          handleChangeFilter(changedValues, values)
                        }
                      >
                        <Form.Item
                          name="category"
                          label="Danh mục sản phẩm"
                          labelCol={{ span: 24 }}
                        >
                          <Checkbox.Group>
                            <Row>
                              {listCategory?.map((item, index) => {
                                return (
                                  <Col
                                    span={24}
                                    key={`index-${index}`}
                                    style={{ padding: "7px 0" }}
                                  >
                                    <Checkbox value={item.value}>
                                      {item.label}
                                    </Checkbox>
                                  </Col>
                                );
                              })}
                            </Row>
                          </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                          <Row gutter={[10, 10]} style={{ width: "100%" }}>
                            <Col xl={11} md={24}>
                              <Form.Item name={["range", "from"]}>
                                <InputNumber
                                  name="from"
                                  min={0}
                                  placeholder="đ TỪ"
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xl={2} md={0}>
                              <div> - </div>
                            </Col>
                            <Col xl={11} md={24}>
                              <Form.Item name={["range", "to"]}>
                                <InputNumber
                                  name="to"
                                  min={0}
                                  placeholder="đ ĐẾN"
                                  formatter={(value) =>
                                    `${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <div>
                            <Button
                              onClick={() => form.submit()}
                              style={{ width: "100%" }}
                              type="primary"
                            >
                              Áp dụng
                            </Button>
                          </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                          <div>
                            <Rate
                              value={5}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text"></span>
                          </div>
                          <div>
                            <Rate
                              value={4}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text">trở lên</span>
                          </div>
                          <div>
                            <Rate
                              value={3}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text">trở lên</span>
                          </div>
                          <div>
                            <Rate
                              value={2}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text">trở lên</span>
                          </div>
                          <div>
                            <Rate
                              value={1}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 15 }}
                            />
                            <span className="ant-rate-text">trở lên</span>
                          </div>
                        </Form.Item>
                      </Form>
                    </div>
                  </Drawer>
                ) : (
                  ""
                )}
              </div>
              <Row>
                <div className="customize-row">
                  {listBook.length > 0 ? (
                    listBook.map((item, index) => {
                      return (
                        <div
                          className="column"
                          key={`book-${index}`}
                          onClick={() => handleRedirectBook(item)}
                        >
                          <div className="wrapper">
                            <div className="thumbnail">
                              <img
                                src={`http://localhost:8080/images/book/${item.thumbnail}`}
                                alt=""
                                className="src"
                              />
                            </div>
                            <span>{item.mainText}</span>
                            <div className="price">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.price)}
                            </div>
                            <div className="rating">
                              <Rate
                                value={5}
                                disabled
                                style={{ color: "#ffce3d", fontSize: 10 }}
                              />
                              <span>Đã bán {item.sold}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-book">
                      <Empty description="Không có dữ liệu" />
                    </div>
                  )}
                </div>
              </Row>
              <div className="pagination">
                <Row>
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    responsive
                    onChange={(p, s) =>
                      handleOnChangePage({ current: p, pageSize: s })
                    }
                  />
                </Row>
              </div>
            </div>
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
