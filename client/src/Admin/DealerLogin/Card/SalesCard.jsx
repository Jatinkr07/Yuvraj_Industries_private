/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "antd";

export default function SalesCard({
  type,
  srNo,
  date,
  warrantyPeriod,
  warrantyEndDate,
  onReplace,
  isWarrantyActive,
}) {
  return (
    <div className="max-w-9xl mx-auto p-4 grid lg:grid-cols-1">
      <div className="border-2 border-black rounded-sm">
        <div className="border-b border-gray-300 p-4">
          <h1 className="text-[13px] text-nowrap md:text-xl font-bold text-center">
            MFD. BY - YUVRAJ INDUSTRIES, FARIDABAD, HARYANA
          </h1>
        </div>
        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-3 border-r border-gray-800">
            <p className="text-sm md:text-lg">{type}</p>
          </div>
          <div className="p-3">
            <p className="text-sm md:text-lg">S.R. NO. - {srNo}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-3 border-r border-gray-700">
            <div className="space-y-2">
              <p className="text-sm md:text-lg text-gray-600">Date</p>
              <p className="text-sm md:text-lg">{date}</p>
            </div>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              <p className="text-sm md:text-lg text-gray-600">
                Warranty Period
              </p>
              <p className="text-sm md:text-lg">{warrantyPeriod}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-3">
          <div className="w-24 h-12 relative">
            <img src="/logo.webp" className="object-contain" alt="Logo" />
          </div>
          <Button
            type="primary"
            size="large"
            className="bg-[#4338CA] hover:bg-[#3730A3] border-none rounded-md px-8"
            disabled={isWarrantyActive}
            onClick={onReplace}
          >
            Replace
          </Button>
        </div>
      </div>
    </div>
  );
}
