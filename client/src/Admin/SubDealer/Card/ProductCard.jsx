/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Card } from "antd";

export default function ProductCard({ product }) {
  const {
    productName = "N/A",
    stage = "N/A",
    power = "N/A",
    pipeSize = "N/A",
    warranty = "N/A",
    warrantyUnit = "days",
    warrantyStartDate,
    warrantyEndDate,
    serialNumber = "N/A",
    addedOn = new Date(),
    quantity = "N/A",
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

  const powerString = power
    ? `${power.kw || "N/A"}/${power.hp || "N/A"}`
    : "N/A";

  const warrantyPeriod =
    warrantyStartDate && warrantyEndDate
      ? `${new Date(warrantyStartDate).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })} - ${new Date(warrantyEndDate).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`
      : "Not Started";

  return (
    <Card className="w-full max-w-md lg:max-w-full grid grid-cols-1 lg:grid-cols-1 mx-auto border-2 border-black gap-4">
      <div className="border-black border-t-2 border-l-2 border-r-2 p-3.5 text-center">
        <h1 className="text-[13px] md:text-[22px] font-bold text-black text-nowrap">
          MFD. BY - YUVRAJ INDUSTRIES, FARIDABAD, HARYANA
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 border-t-2 border-black text-black">
        <div className="border-black border-r-2 lg:border-r-2">
          <div className="border-b-2 border-black border-l-2 p-3 text-center">
            <h2 className="font-[500] text-[10px] lg:text-[12.5px] uppercase">
              {productName}
            </h2>
          </div>
          {[
            { label: "STAGE", value: stage },
            { label: "KW/HP", value: powerString },
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

      <div className="grid grid-cols-2 lg:grid-cols-2 border-t-2 border-black border-l-2 border-b-2 border-r-2 text-black">
        <div className="p-4 border-r-2 border-black">
          <div className="font-bold lg:text-lg text-[13px]">
            S.R. NO. - {serialNumber}
          </div>
          <div className="lg:text-lg text-xs">
            Month / Year of MFG. : {monthYear.toUpperCase()}
          </div>
        </div>
        <div className="p-4 flex flex-col lg:justify-end items-start space-y-2">
          <div className="font-bold lg:text-lg text-sm">Date :</div>
          <span className="lg:text-lg text-sm">{formattedDate}</span>
          <div className="font-bold lg:text-lg text-sm">Warranty Period :</div>
          <span className="lg:text-lg text-sm">{warrantyPeriod}</span>
        </div>
      </div>
    </Card>
  );
}
