import { Card } from "antd";

export default function ProductCard() {
  return (
    <Card className="max-w-9xl grid grid-cols-1 lg:grid-cols-2 mx-auto border-2 border-black">
      {/* Header */}
      <div className=" border-black border-r-2 border-t-2 border-l-2 p-3.5 text-center">
        <h1 className="text-[13px] md:text-[22px] font-bold text-black text-nowrap">
          MFD. BY - YUVRAJ INDUSTRIES, FARIDABAD, HARYANA
        </h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 border-t-2 border-black text-black">
        {/* Left Column */}
        <div className="border-r-2 border-black">
          <div className="border-b-2 border-black border-l-2 p-3 text-center">
            <h2 className="font-bold text-xs lg:text-[14px]">
              SUBMERSIBLE SET
            </h2>
          </div>
          {[
            { label: "STAGE", value: "15" },
            { label: "KW/HP", value: "1.5/2" },
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

        {/* Right Column */}
        <div>
          <div className="border-b-2 border-black p-3 text-center border-r-2 text-black">
            <div className="lg:text-[12px] text-[10px] text-nowrap">
              WET (OIL FILLED), BORE SIZE: 10 mm
            </div>
          </div>
          {[
            { label: "PIPE SIZE", value: "32 mm" },
            { label: "PHASE", value: "1 ph" },
            { label: "QUANTITY", value: "One Set" },
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

      {/* Footer */}
      <div className="grid grid-cols-2 border-t-2 border-black border-l-2 border-b-2 border-r-2 text-black">
        <div className="p-4 border-r-2 border-black">
          <div className="font-bold lg:text-lg text-[13px]">
            S.R. NO. - 24517D56
          </div>
          <div className="lg:text-lg text-xs">
            Month / Year of MFG. : DEC/2024
          </div>
        </div>
        <div className="p-4 flex lg:justify-end items-center space-x-4">
          <div className="font-bold lg:text-lg text-sm">Date :</div>
          <span className="lg:text-lg text-sm">29/12/2024</span>
        </div>
      </div>
    </Card>
  );
}
