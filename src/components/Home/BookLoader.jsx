import { Col, Row, Skeleton } from "antd";

const BookLoader = () => {
  return (
    <div>
      <Row gutter={[20,20]}>
        <Col md={12}>
          <Skeleton.Input active block style={{width:'100%',height:'350px'}} />
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px",marginTop:'15px' }}
          >
            <Skeleton.Image active />
            <Skeleton.Image active />
            <Skeleton.Image active />
          </div>
        </Col>
        <Col md={12}>
        <Skeleton paragraph/>
        <Skeleton paragraph />
        <div>
        <Skeleton.Button active style={{margin:'0 20px'}}/>
        <Skeleton.Button active />
        </div>
        </Col>
      </Row>
    </div>
  );
};

export default BookLoader;
