/* eslint-disable react/prop-types */
import { Modal, QRCode, Typography, Card, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { toPng } from "html-to-image";

const { Title, Text } = Typography;

const InnerTemplate = ({ product, visible, onClose }) => {
  const qrValue = product?.barcode || product?.serialNumber || "N/A";

  const categoryName = product?.category?.name || "SUBMERSIBLE MOTOR SET";
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
          bodyStyle={{ padding: "24px" }}
        >
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
            <Title
              level={3}
              className="text-start w-full uppercase font-bold text-xl"
              style={{ letterSpacing: "1px", margin: "0px" }}
            >
              {categoryName.toUpperCase()}
            </Title>
            <QRCode value={qrValue} size={130} />
          </div>
          <div className="text-center mt-4">
            <Title
              level={1}
              className="text-center w-full uppercase font-bold lg:text-4xl text-xl"
              style={{ letterSpacing: "1px", margin: "0px" }}
            >
              {subSubcategoryName.toUpperCase()}
            </Title>
            <Text strong style={{ fontSize: "16px" }}>
              Sr. No. {product?.serialNumber || "2411D5022"}
            </Text>{" "}
            |{" "}
            <Text strong style={{ fontSize: "16px" }}>
              MODEL {product?.productName || "YIO410"}
            </Text>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            <div>
              <Text strong className="uppercase block">
                DELIVERY
              </Text>
              <div>{product?.pipeSize || "32 mm"}</div>
            </div>
            <div>
              <Text strong className="uppercase block">
                STAGE
              </Text>
              <div>{product?.stage || "10"}</div>
            </div>
            <div>
              <Text strong className="uppercase block">
                YEAR OF MFG.
              </Text>
              <div>
                {product?.addedOn
                  ? new Date(product.addedOn).getFullYear()
                  : "2025"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-sm">
            <div>
              <Text strong className="uppercase block">
                DUTY POINT
              </Text>
              <div>Nom. HEAD</div>
              <div>{product?.maxHead || "38 m"}</div>
            </div>
            <div>
              <Text strong className="uppercase block">
                OVERALL
              </Text>
              <div>Nom. DIS</div>
              <div>{product?.maxDischarge || "3600 LPH"}</div>
            </div>
            <div>
              <Text strong className="uppercase block">
                EFFICIENCY
              </Text>
              <div>{product?.efficiency || "25.5(%)Min."}</div>
            </div>
            <div>
              <Text strong className="uppercase block">
                RATED SPEED
              </Text>
              <div>{product?.ratedSpeed || "-8% + 5%"}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4 text-sm">
            <div>
              <Text strong className="uppercase block">
                BORE
              </Text>
              <div>{product?.pipeSize || "100mm"}</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Text strong className="uppercase text-base">
              OPERATION HEAD RANGE{" "}
              {product?.operationHeadRange || "28.0 m TO 38.0 m"}
            </Text>
          </div>

          <div className="mt-4 text-sm">
            <Text strong>
              MOTOR:{" "}
              {product?.motorSpecs ||
                `${product?.power || "01 HP"}, ${
                  product?.volts || "220V"
                } + 6% -15%, 50Hz, CAT.B, DUTY:S1`}
            </Text>
            <div>TYPE OIL FILLED, CAPACITOR START & RUN, FREQ. 50Hz</div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
            <div>
              <Text strong className="uppercase underline">
                MOTOR
              </Text>
              <div>{product?.power || "HP 1.0"}</div>
            </div>
            <div>
              <Text strong className="uppercase underline">
                MAX CURRENT
              </Text>
              <div>7.3A</div>
            </div>
            <div>
              <Text strong className="uppercase underline">
                CAPACITOR
              </Text>
              <div>50 mfd,440 V</div>
            </div>
            <div>
              <Text strong className="uppercase underline">
                RATING
              </Text>
              <div> KW 0.75</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Title level={4} className="m-0 uppercase font-bold">
              MFG BY:- {subcategoryName.toUpperCase()}
            </Title>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default InnerTemplate;
