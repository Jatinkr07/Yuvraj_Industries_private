export default function SalesCard() {
  return (
    <div className="max-w-9xl mx-auto p-4 grid grid-cols-2">
      <div className="border-2 border-black  rounded-sm ">
        <div className="border-b border-gray-300 p-4">
          <h1 className="text-[13px] text-nowrap md:text-xl font-bold text-center">
            MFD. BY - YUVRAJ INDUSTRIES, FARIDABAD, HARYANA
          </h1>
        </div>

        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-3 border-r border-gray-800">
            <p className="text-sm md:text-lg">SUBMERSIBLE SET</p>
          </div>
          <div className="p-3">
            <p className="text-sm md:text-lg">S.R. NO. - 24517D56</p>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-3 border-r border-gray-700">
            <div className="space-y-2">
              <p className="text-sm md:text-lg text-gray-600">Date</p>
              <p className="text-sm md:text-lg">18/05/2025</p>
            </div>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              <p className="text-sm md:text-lg text-gray-600">
                Warranty Period
              </p>
              <p className="text-sm md:text-lg">18/05/2025 - 17/05/2025</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-3">
          <div className="w-24 h-12 relative">
            <img src="/logo.webp" className="object-contain" />
          </div>
          <button
            type="primary"
            size="large"
            className="bg-[#7CB9E8] hover:bg-[##7CB9E8] border-none rounded-md px-8 py-2 text-white "
          >
            Replace
          </button>
        </div>
      </div>
    </div>
  );
}
