// components/products/ProductTemplate.jsx
/* eslint-disable react/prop-types */
import { Modal, QRCode } from "antd";

const ProductTemplate = ({ product, visible, onClose }) => {
  const qrValue = product?.barcode || product?.serialNumber || "N/A";

  return (
    <Modal
      title="Product Template"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width="50%"
    >
      <div className="bg-gray-50  rounded-lg border border-gray-300 shadow-sm ">
        <div className="flex justify-between p-2">
          <div className="flex-grow"></div>
          <div className="w-32 h-32">
            <QRCode value={qrValue} size={120} />
          </div>
        </div>

        <div className="border-t border-b border-gray-300 p-2 text-center">
          <p className="text-xs font-semibold">
            {/* MFD. BY: YUVRAJ INDUSTRIES, FARIDABAD (HARYANA) */}
            {product?.category?.name?.toUpperCase() || "N/A"}
          </p>
          <p className="text-xs">(AN ISO 9001 - 2015 CERTIFIED CO.)</p>
        </div>

        <div className="border-b border-gray-300 p-1 text-center">
          <p className="text-sm font-semibold">
            <p className="text-xs">{product?.subcategory || "N/A"}</p>
          </p>
        </div>

        <div className="border-b border-gray-300 p-1 text-center">
          <p> {product?.productName}</p>
        </div>

        <div className="grid grid-cols-2 text-xs">
          <div className="border-b border-r border-gray-300 p-1 flex justify-between">
            <span className="text-sm lg:text-lg">STAGE:</span>
            <span className="font-[600] text-xl lg:text-3xl">
              {product?.stage || "N/A"}
            </span>
          </div>
          <div className="border-b border-r border-gray-300 p-1 flex justify-between">
            <span className="text-sm lg:text-base">Pipe Size</span>
            <span className="font-bold text-xl lg:text-2xl">
              {product?.pipeSize || "N/A"}
            </span>
          </div>
          <div className="border-b border-r border-gray-300 p-1 flex justify-between">
            <span className="text-sm lg:text-base">KW / HP:</span>
            <span className="font-bold text-xl lg:text-2xl">
              {product?.power || "N/A"}
            </span>
          </div>
          <div className="border-b border-r border-gray-300 p-1 flex justify-between">
            <span className="text-sm lg:text-base">Phase</span>
            <span className="font-bold text-xl lg:text-2xl">
              {product?.maxHead || "N/A"}
            </span>
          </div>
          <div className="border-b border-r border-gray-300 p-1 flex justify-between">
            <span className="text-sm lg:text-base">Volts</span>
            <span className="font-bold text-xl lg:text-2xl">
              {product?.power || "N/A"}
            </span>
          </div>
          <div className="border-b border-r border-gray-300 p-1 flex justify-between">
            <span className="text-sm lg:text-base">OTY : </span>
            <span className="font-bold text-xl lg:text-2xl">
              {product?.quantityText || "N/A"}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-300 p-1 text-center">
          <p className="text-sm lg:text-2xl font-bold">
            S.R. NO.-
            <span className="text-3xl tracking-wider font-bold">
              {product?.serialNumber || "N/A"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 text-xs">
          <div className="border-r border-gray-300 p-1 gap-8 flex flex-row lg:-ml-24 items-center justify-center">
            <div className="w-32 h-16 relative">
              <img
                src="/logo.webp"
                alt="Make in India logo"
                className="object-contain"
              />
            </div>
            <div className="w-16 h-32 mt-1">
              <QRCode value="https://example.com/made-in-india" size={120} />
            </div>
          </div>
          <div className=" p-1">
            <div className="text-center mb-2 text-[20px]">
              Month / Year of Mfg.:
            </div>
            <div className="text-center">
              <p className="lg:text-3xl font-bold">
                {product?.addedOn
                  ? new Date(product.addedOn)
                      .toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                      })
                      .toUpperCase()
                  : "N/A"}
              </p>
              <p className="text-lg font-bold">MADE IN INDIA</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductTemplate;
