/* eslint-disable react/prop-types */
// Card/ReplacedCard.jsx
export default function ReplacedCard({
  type,
  srNo,
  newNo,
  replacedDate,
  warrantyPeriod,
}) {
  return (
    <div className="max-w-9xl lg:grid-cols-2 grid mx-auto p-4">
      <div className="border-2 border-gray-800">
        <div className="border-b border-gray-300 p-4">
          <h1 className="text-xl md:text-2xl font-bold text-center">
            MFD. BY - YUVRAJ INDUSTRIES, FARIDABAD, HARYANA
          </h1>
        </div>

        <div className="grid grid-cols-3 text-nowrap border text-center border-gray-300">
          <div className="p-2 border-r border-gray-800 flex flex-col justify-center">
            <h2 className="text-xs md:text-xl text-gray-600">{type}</h2>
          </div>
          <div className="p-2 border-r border-gray-800 flex flex-col justify-center">
            <h2 className="text-xs md:text-xl text-gray-600">
              S.R. NO. - {srNo}
            </h2>
          </div>
          <div className="p-1 flex flex-col justify-center">
            <h2 className="text-[11px] md:text-xl text-gray-600">
              NEW NO. - {newNo}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 border border-gray-300">
          <div className="p-2 border-b-gray-300 md:border-b-0 border-r-gray-900 flex flex-col">
            <h2 className="text-sm md:text-xl font-medium text-gray-600 mb-2">
              Replaced Date
            </h2>
            <p className="text-sm lg:text-xl">{replacedDate}</p>
          </div>

          <div className="p-2 flex flex-col border-l border-black">
            <h2 className="text-sm md:text-xl font-medium text-gray-600 mb-2">
              Warranty Period
            </h2>
            <p className="text-sm lg:text-xl">{warrantyPeriod}</p>
          </div>
        </div>

        <div className="p-1.5 flex justify-start">
          <div className="relative w-28 h-12 lg:h-24">
            <img
              src="/logo.webp"
              alt="Made in India"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
