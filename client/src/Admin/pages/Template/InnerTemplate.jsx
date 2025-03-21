/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, QRCode, Typography, Card, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { toPng } from "html-to-image";
import { getCategories } from "../../../Services/api";

const { Title } = Typography;

const InnerTemplate = ({ product, visible, onClose }) => {
  const [category, setCategory] = useState(product?.category || {});
  const qrValue = product?.barcode || product?.serialNumber || "N/A";

  useEffect(() => {
    if (visible && product?.category?._id && !product.category.image) {
      const fetchLatestCategory = async () => {
        try {
          const categories = await getCategories();
          const latestCategory = categories.find(
            (cat) => cat._id === product.category._id
          );
          if (latestCategory) setCategory(latestCategory);
        } catch (error) {
          console.error("InnerTemplate - Fetch Category Error:", error);
        }
      };
      fetchLatestCategory();
    }
  }, [visible, product]);

  console.log("InnerTemplate - Category Object:", category);
  console.log("InnerTemplate - Category Name:", category.name);
  console.log("InnerTemplate - Category Image:", category.image);

  const hasName = !!category.name && typeof category.name === "string";
  const hasImage =
    !!category.image &&
    typeof category.image === "string" &&
    category.image.trim() !== "";
  const categoryName = hasName && hasImage ? category.name : "";
  console.log("InnerTemplate - Has Name:", hasName);
  console.log("InnerTemplate - Has Image:", hasImage);
  console.log("InnerTemplate - Category Name Calculated:", categoryName);

  const subcategoryName = product?.subcategory || "YUVRAJ INDUSTRIES";
  const subSubcategoryName = product?.subSubcategory || "SUBMERSIBLE MOTOR SET";

  const downloadTemplate = async () => {
    const element = document.querySelector(".inner-template-card");
    if (!element) {
      console.error("Template element not found");
      return;
    }
    try {
      const dataUrl = await toPng(element, { cacheBust: true });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `inner-template-${
        product?.serialNumber || "unknown"
      }.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <Modal
      title="Inner Product Template"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={downloadTemplate}
        >
          Download
        </Button>,
      ]}
      centered
      width="52%"
    >
      <div className="inner-template-card">
        <Card
          className="w-full max-w-7xl bg-gray-50 border border-gray-300 container mx-auto"
          styles={{ body: { padding: "24px" } }}
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 p-4">
            <Title
              level={3}
              className="text-start w-full uppercase font-bold text-xl"
              style={{ letterSpacing: "1px", margin: "0px" }}
            >
              {categoryName ? categoryName.toUpperCase() : ""}
            </Title>
            <QRCode value={qrValue} size={130} />
          </div>
          {/* Rest of your JSX remains unchanged */}
          <div className="text-center mt-4">
            <h1 className="text-center w-full uppercase font-semibold lg:text-4xl text-xl text-gray-900 tracking-widest">
              {subSubcategoryName.toUpperCase()}
            </h1>
            <div className="flex justify-center gap-12 text-4xl text-gray-900 font-semibold tracking-wide">
              <h1>Sr. No. {product?.serialNumber || "2411D5022"}</h1>
              <h1>MODEL {product?.productName || "YIO410"}</h1>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-gray-900 font-semibold text-sm">
            <div className="flex gap-4 text-3xl">
              <h1>DELIVERY</h1>
              <div>{product?.pipeSize || "32 mm"}</div>
            </div>
            <div className="flex gap-4 text-3xl">
              <h1>STAGE</h1>
              <div>{product?.stage || "10"}</div>
            </div>
            <div className="flex gap-4 text-3xl">
              <h1 className="text-nowrap">YEAR OF MFG.</h1>
              <div>
                {product?.addedOn
                  ? new Date(product.addedOn).getFullYear()
                  : "2025"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 lg:ml-8 mt-4 text-sm text-gray-900 font-semibold">
            <div className="text-[19px]">
              <h1>DUTY POINT</h1>
              <div>Nom. HEAD</div>
              <div>{product?.dutyPoint || "38 m"}</div>
            </div>
            <div className="text-[19px]">
              <h1>OVERALL</h1>
              <div>Nom. DIS</div>
              <div>{product?.nomDis || "3600 LPH"}</div>
            </div>
            <div className="text-[19px]">
              <h1>OVERALL</h1>
              <h1>EFFICIENCY</h1>
              <div>{product?.overallEfficiency || "25.5(%)Min."}</div>
            </div>
            <div className="text-[19px]">
              <h1>RATED SPEED</h1>
              <div>{product?.ratedSpeed || "-8% + 5%"}</div>
            </div>
            <div className="text-[19px]">
              <h1>BORE</h1>
              <div>{product?.pipeSize || "100mm"}</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h1 className="tracking-widest text-[19px] text-gray-900 font-semibold">
              OPERATION HEAD RANGE{" "}
              {product?.operatorHeadRange || "28.0 m TO 38.0 m"}
            </h1>
          </div>
          <div className="mt-4 text-[19px] text-gray-900 tracking-widest px-4">
            <h1 className="font-semibold">
              MOTOR:{" "}
              {product?.motor ||
                `${product?.power?.hp || "01"} HP, ${
                  product?.volts || "220V"
                } + 6% -15%, 50Hz, CAT.B, DUTY:S1`}
            </h1>
            <div className="font-semibold">{product?.description}</div>
          </div>
          <div className="mt-4 font-semibold px-4 grid grid-cols-4 gap-2 text-sm">
            <div className="text-gray-900 text-[17px]">
              <div className="flex gap-8">
                <h1 className="uppercase underline">MOTOR</h1>
                <div>
                  {product?.power ? `${product.power.hp} HP` : "HP 1.0"}
                </div>
              </div>
              <div className="flex gap-8">
                <h1 className="uppercase underline">RATING</h1>
                <div>
                  {product?.power ? `${product.power.kw} KW` : "HP 1.0"}
                </div>
              </div>
            </div>
            <div>
              <h1 className="tracking-wider text-gray-900 text-[17px]">
                MAX CURRENT
              </h1>
              <div className="text-gray-900 tex-[17px]">
                {product?.maxCurrent || "7.3A"}
              </div>
            </div>
            <div className="text-gray-900 text-[17px]">
              <h1 className="uppercase underline">CAPACITOR</h1>
              <div>{product?.capacitor || "50 mfd,440 V"}</div>
            </div>
            <div className="text-gray-900 text-[17px]">
              <h1 className="uppercase underline">RATING</h1>
              <div>{product?.power ? `KW ${product.power.kw}` : "KW 0.75"}</div>
            </div>
          </div>
          <div className="mt-4 text-center text-3xl text-gray-900">
            <h1 className="m-0 uppercase font-bold">
              MFG BY:- {subcategoryName.toUpperCase()}
            </h1>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default InnerTemplate;
