import { FaHeart, FaUserTie, FaShoppingBag, FaRecycle } from "react-icons/fa";
import Cards from "../components/dashboard/Cards";
import SalesTable from "../components/dashboard/SalesTable";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";

const Dashboard = () => {
  const stats = [
    {
      id: 1,
      count: 178,
      label: "Total Products",
      icon: <FaHeart className="text-xl text-indigo-600" />,
      bgColor: "bg-indigo-100",
    },
    {
      id: 2,
      count: 22,
      label: "Total Dealers",
      icon: <FaUserTie className="text-xl text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      id: 3,
      count: 164,
      label: "Sales Products",
      icon: <FaShoppingBag className="text-xl text-pink-600" />,
      bgColor: "bg-pink-100",
    },
    {
      id: 4,
      count: 16,
      label: "Replaced Products",
      icon: <FaRecycle className="text-xl text-blue-600" />,
      bgColor: "bg-blue-100",
    },
  ];
  const tableData = [
    {
      key: "1",
      serial: "#876364",
      product: "0.5 HP Maxi",
      dealer: "Aman",
      status: "In Warranty",
    },
    {
      key: "2",
      serial: "#876368",
      product: "Y1420",
      dealer: "Mayank",
      status: "In Warranty",
    },
    {
      key: "3",
      serial: "#876412",
      product: "1.0 HP Maxiflow",
      dealer: "Inderjeet",
      status: "Warranty Out",
    },
    {
      key: "4",
      serial: "#876621",
      product: "Y4102",
      dealer: "Gaurav",
      status: "In Warranty",
    },
  ];
  return (
    <div className="w-full">
      <Cards data={stats} />
      <div className="grid mt-10 gap-5 grid-cols-2">
        <div className="w-full">
          <SalesTable data={tableData} />
        </div>
        <div className="w-full">
          <AnalyticsChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
