/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Card } from "antd";

export default function ProductCard({ product }) {
  const {
    productName = "SUBMERSIBLE SET",
    stage = "15",
    power = "1.5/2",
    pipeSize = "32 mm",
    warranty = "1 year",
    serialNumber = "24517D56",
    addedOn = new Date(),
    quantity = "One Set",
  } = product || {};

  const formattedDate = new Date(addedOn).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const monthYear = new Date(addedOn).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="w-[1550px] grid grid-cols-1 lg:grid-cols-2 mx-auto border-2 border-black gap-12">
      <div className="border-black border-r-2 border-t-2 border-l-2 p-3.5 text-center ">
        <h1 className="text-[13px] md:text-[22px] font-bold text-black text-nowrap">
          MFD. BY - YUVRAJ INDUSTRIES, FARIDABAD, HARYANA
        </h1>
      </div>

      <div className="grid grid-cols-2 border-t-2 border-black text-black">
        <div className="border-r-2 border-black">
          <div className="border-b-2 border-black border-l-2 p-3 text-center">
            <h2 className="font-bold text-xs lg:text-[14px] uppercase">
              {productName}
            </h2>
          </div>
          {[
            { label: "STAGE", value: stage },
            { label: "KW/HP", value: power },
            { label: "VOLTS", value: "240V" },
          ].map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 border-b-2 border-black border-l-2 p-2 last:border-b-0 lg:text-lg text-xs"
            >
              <div className="font-bold">{item.label} :</div>
              <div className="text-right">{item.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="border-b-2 border-black p-3 text-center border-r-2 text-black">
            <div className="lg:text-[12px] text-[10px] text-nowrap">
              WET (OIL FILLED), BORE SIZE: 10 mm
            </div>
          </div>
          {[
            { label: "PIPE SIZE", value: pipeSize },
            { label: "PHASE", value: "1 ph" },
            { label: "QUANTITY", value: quantity },
          ].map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 border-b-2 border-black p-2 border-r-2 last:border-b-0 lg:text-lg text-xs"
            >
              <div className="font-bold">{item.label} :</div>
              <div className="text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 border-t-2 border-black border-l-2 border-b-2 border-r-2 text-black">
        <div className="p-4 border-r-2 border-black">
          <div className="font-bold lg:text-lg text-[13px]">
            S.R. NO. - {serialNumber}
          </div>
          <div className="lg:text-lg text-xs">
            Month / Year of MFG. : {monthYear.toUpperCase()}
          </div>
        </div>
        <div className="p-4 flex lg:justify-end items-center space-x-4">
          <div className="font-bold lg:text-lg text-sm">Date :</div>
          <span className="lg:text-lg text-sm">{formattedDate}</span>
        </div>
      </div>
    </Card>
  );
}
