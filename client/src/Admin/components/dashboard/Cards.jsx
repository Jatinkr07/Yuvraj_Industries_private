/* eslint-disable react/prop-types */

const Cards = ({ data }) => {
  return (
    <div className="flex justify-between  p-6 bg-gray-50">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md rounded-lg p-6 py-10 flex items-center gap-6 w-84"
        >
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${item.bgColor}`}
          >
            {item.icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {item.count}
            </h3>
            <p className="text-gray-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
