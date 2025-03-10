/* eslint-disable react/prop-types */
import { Modal } from "antd";
import { QRCode } from "antd";
import { Typography, Card, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;

const InnerTemplate = ({ product, visible, onClose }) => {
  const qrValue = product?.barcode || product?.serialNumber || "N/A";

  const downloadTemplate = () => {
    const element = document.querySelector(".inner-template-card");
    if (!element) {
      console.error("Template element not found");
      return;
    }

    // Use html2canvas to capture the card as an image
    import("html2canvas").then((html2canvas) => {
      html2canvas.default(element).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(
            blob,
            `inner-template-${product?.serialNumber || "unknown"}.png`
          );
        });
      });
    });
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
      width="50%"
    >
      <div className="inner-template-card">
        <Card
          className="w-full max-w-md bg-gray-50 border border-gray-300"
          bodyStyle={{ padding: "16px" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <Title
                level={3}
                className="font-serif tracking-wider m-0 uppercase font-bold"
              >
                {product?.subcategory?.toUpperCase() || "SUBMERSIBLE MOTOR SET"}
              </Title>
              <div className="flex flex-wrap gap-x-4 mt-1">
                <Text strong>Sr. No. {product?.serialNumber || "N/A"}</Text>
                <Text strong>MODEL {product?.productName || "N/A"}</Text>
              </div>
            </div>
            <QRCode value={qrValue} size={80} className="ml-2" />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            <div>
              <Text strong className="uppercase">
                Pipe Size
              </Text>
              <div>{product?.pipeSize || "N/A"}</div>
            </div>
            <div>
              <Text strong className="uppercase">
                Stage
              </Text>
              <div>{product?.stage || "N/A"}</div>
            </div>
            <div>
              <Text strong className="uppercase">
                Year of MFG.
              </Text>
              <div>
                {product?.addedOn
                  ? new Date(product.addedOn).getFullYear()
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            <div>
              <Text strong className="uppercase">
                Duty Point
              </Text>
              <div>Nom. HEAD</div>
              <div>{product?.maxHead || "N/A"}</div>
            </div>
            <div>
              <Text strong className="uppercase">
                Overall
              </Text>
              <div>Nom. DIS</div>
              <div>{product?.maxDischarge || "N/A"}</div>
            </div>
            <div>
              <Text strong className="uppercase">
                Phase
              </Text>
              <div>{product?.phase || "N/A"}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            <div>
              <Text strong className="uppercase">
                Volts
              </Text>
              <div>{product?.volts || "N/A"}</div>
            </div>
            <div>
              <Text strong className="uppercase">
                Power
              </Text>
              <div>{product?.power || "N/A"}</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Text strong className="uppercase text-base">
              OPERATION HEAD RANGE{" "}
              {product?.maxHead
                ? `${product.maxHead} TO ${product.maxHead}`
                : "N/A"}
              ,
            </Text>
          </div>

          <div className="mt-4 text-sm">
            <Text strong>
              MOTOR: {product?.power || "N/A"}, {product?.volts || "N/A"},{" "}
              {product?.phase || "N/A"}
            </Text>
            <div>TYPE OIL FILLED, CAPACITOR START & RUN, FREQ. 50Hz</div>
          </div>

          <div className="mt-4 text-sm">
            <Text strong className="uppercase underline">
              Rating
            </Text>
            <Text> KW {product?.power?.split("/")[0] || "N/A"}</Text>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="w-3/4">
              <svg viewBox="0 0 100 12" className="w-full">
                <rect x="0" y="0" width="100" height="12" fill="black" />
              </svg>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Title level={4} className="m-0 uppercase font-bold">
              MFG BY:-{" "}
              {product?.category?.name?.toUpperCase() || "YUVRAJ INDUSTRIES"}
            </Title>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default InnerTemplate;
