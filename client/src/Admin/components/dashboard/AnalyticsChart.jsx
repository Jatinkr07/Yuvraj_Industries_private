/* eslint-disable react/prop-types */
import { Pie } from "@ant-design/plots";

const AnalyticsChart = ({ data }) => {
  const config = {
    data,
    angleField: "value",
    colorField: "type",
    color: data.map((item) => item.color),
    radius: 0.8,
    innerRadius: 0.6,
    legend: false,
    interactions: [{ type: "element-active" }],
    label: false,
    height: 300,
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <span className="text-gray-500 text-lg cursor-pointer">⋮</span>
      </div>
      <Pie {...config} />
      {/* Custom Legend */}
      <div className="flex justify-center gap-6 mt-4">
        {data.map((item) => (
          <div key={item.type} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-gray-500 text-sm">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsChart;
