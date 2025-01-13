import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import { SalesDataContext } from "../../../context/SalesDataContext";
import "./SalesChart.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const { salesData, timeRange } = useContext(SalesDataContext);

  const labels = salesData.map((entry) => {
    const date = new Date(entry.label);
    return timeRange === "daily"
      ? date.getHours() + ":00"
      : date.toLocaleDateString();
  });

  const sales = salesData.map((entry) => entry.sales);
  const orders = salesData.map((entry) => entry.orders);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: sales,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        borderJoinStyle: "bevel",
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: orders,
        borderColor: "rgba(255, 99, 91, 1)",
        backgroundColor: "rgba(255, 99, 91, 0.2)",
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          display: false,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
