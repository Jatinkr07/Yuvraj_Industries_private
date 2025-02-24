import { Col, Input, Row, Select } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import ProductCard from "../Card/ProductCard";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  // const productData = [
  //   {
  //     stage: "15",
  //     hp: "1.5/2",
  //     volts: "240V",
  //     pipeSize: "32 mm",
  //     phase: "1 ph",
  //     quantity: "One Set",
  //     srNo: "24507056",
  //     date: "29/12/2024",
  //   },
  //   // Add more product items as needed
  // ];

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Right Side: Category Filter & Search */}
        <div className="flex flex-wrap items-center  gap-24">
          <Select
            placeholder="Category"
            style={{ width: 200, height: 40 }}
            options={[
              { value: "category1", label: "Category 1" },
              { value: "category2", label: "Category 2" },
            ]}
          />
          <Link to="/sale/barcode">
            <button
              className="px-3 py-2 bg-[#7CB9E8] text-white hover:bg-white hover:text-[#7CB9E8] border border-[#7CB9E8] font-[500] rounded-md"
              icon={<PlusOutlined />}
            >
              Add New
            </button>
          </Link>
        </div>{" "}
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 500, padding: "12px", borderRadius: "20px" }}
        />
      </div>

      {/* Product List */}
      {/* <Row gutter={[16, 16]} className="mt-4">
        {productData.map((product, index) => (
          <Col xs={24} sm={24} md={12} lg={8} xl={24} key={index}>
            <Card className="mb-4">
              <div className="text-center border-b pb-2 mb-2 font-bold">
                MFD. BY - YUVRAJ INDUSTRIES, FARIDABAD, HARYANA
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>SUBMERSIBLE SET</div>
                <div></div>
                <div>STAGE:</div>
                <div>{product.stage}</div>
                <div>KW/HP:</div>
                <div>{product.hp}</div>
                <div>VOLTS:</div>
                <div>{product.volts}</div>
                <div>PIPE SIZE:</div>
                <div>{product.pipeSize}</div>
                <div>PHASE:</div>
                <div>{product.phase}</div>
                <div>QUANTITY:</div>
                <div>{product.quantity}</div>
                <div>S.R. NO. -</div>
                <div>{product.srNo}</div>
                <div>Date:</div>
                <div>{product.date}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row> */}
      <Row gutter={[16, 16]} className="py-12">
        <Col xs={24} sm={24} md={24} lg={8} xl={24}>
          <ProductCard />
        </Col>
      </Row>
    </div>
  );
}
