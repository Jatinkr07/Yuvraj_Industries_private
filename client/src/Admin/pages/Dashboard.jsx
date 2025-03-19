import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaUserTie, FaShoppingBag, FaRecycle } from "react-icons/fa";
import Cards from "../components/dashboard/Cards";
import SalesTable from "../components/dashboard/SalesTable";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import { API_URL } from "../../Services/api";

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      id: 1,
      count: 0,
      label: "Total Products",
      icon: <FaHeart className="text-xl text-indigo-600" />,
      bgColor: "bg-indigo-100",
    },
    {
      id: 2,
      count: 0,
      label: "Total Dealers",
      icon: <FaUserTie className="text-xl text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      id: 3,
      count: 0,
      label: "Total Sub Dealer",
      icon: <FaRecycle className="text-xl text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      id: 4,
      count: 0,
      label: "Sales Products",
      icon: <FaShoppingBag className="text-xl text-pink-600" />,
      bgColor: "bg-pink-100",
    },
    {
      id: 5,
      count: 0,
      label: "Replaced Products",
      icon: <FaRecycle className="text-xl text-blue-600" />,
      bgColor: "bg-blue-100",
    },
  ]);

  const [tableData, setTableData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const productsResponse = await axios.get(`${API_URL}/api/products`, {
        params: { page: 1, limit: 1 },
      });
      const totalProducts = productsResponse.data.total || 0;

      const dealersResponse = await axios.get(
        `${API_URL}/api/dealer/v1/dealer/all/list`
      );
      const totalDealers = Array.isArray(dealersResponse.data)
        ? dealersResponse.data.length
        : 0;

      const subDealersResponse = await axios.get(
        `${API_URL}/api/dealer/v1/subdealer/all/list`
      );
      const totalSubDealers = Array.isArray(subDealersResponse.data)
        ? subDealersResponse.data.length
        : 0;

      const salesResponse = await axios.get(`${API_URL}/api/sale/v1/sales/all`);
      const totalSales = Array.isArray(salesResponse.data.sales)
        ? salesResponse.data.sales.length
        : 0;

      const replacementsResponse = await axios.get(
        `${API_URL}/api/sale/v1/replacements/all`
      );
      const totalReplacements = Array.isArray(
        replacementsResponse.data.replacements
      )
        ? replacementsResponse.data.replacements.length
        : 0;

      setStats((prevStats) =>
        prevStats.map((stat) => {
          switch (stat.label) {
            case "Total Products":
              return { ...stat, count: totalProducts };
            case "Total Dealers":
              return { ...stat, count: totalDealers };
            case "Total Sub Dealer":
              return { ...stat, count: totalSubDealers };
            case "Sales Products":
              return { ...stat, count: totalSales };
            case "Replaced Products":
              return { ...stat, count: totalReplacements };
            default:
              return stat;
          }
        })
      );

      // Update analytics data for pie chart
      setAnalyticsData([
        { type: "Sale", value: totalSales, color: "#3B4CE9" },
        { type: "Replaced", value: totalReplacements, color: "#2DD4BF" },
        { type: "Dealers", value: totalDealers, color: "#F472B6" },
      ]);

      // Update table data
      const formattedTableData = salesResponse.data.sales
        .slice(0, 4)
        .map((sale, index) => ({
          key: String(index + 1),
          serial: sale.serialNumber || "N/A",
          product: sale.productName || "N/A",
          dealer:
            sale.dealerName !== "None" ? sale.dealerName : sale.subDealerName,
          status:
            new Date(sale.warrantyEndDate) > new Date()
              ? "In Warranty"
              : "Warranty Out",
        }));
      setTableData(formattedTableData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full">
      {loading ? (
        <div>Loading dashboard data...</div>
      ) : (
        <>
          <Cards data={stats} />
          <div className="grid mt-10 gap-5 grid-cols-2">
            <div className="w-full">
              <SalesTable data={tableData} />
            </div>
            <div className="w-full">
              <AnalyticsChart data={analyticsData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
