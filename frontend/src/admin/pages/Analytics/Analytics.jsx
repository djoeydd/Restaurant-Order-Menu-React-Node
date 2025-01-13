import React, { useContext } from "react";
import "./Analytics.css";
import SalesChart from "../../components/SalesChart/SalesChart";
import { SalesDataContext } from "../../../context/SalesDataContext";

const Analytics = () => {
  const {
    salesData,
    timeRange,
    setTimeRange,
    previousSalesData,
    previousTimeRange,
    setPreviousTimeRange,
  } = useContext(SalesDataContext);

  const totalRevenue = salesData.reduce((sum, entry) => sum + entry.sales, 0);
  const totalOrders = salesData.reduce((sum, entry) => sum + entry.orders, 0);
  const previousTotalRevenue = previousSalesData.reduce(
    (sum, entry) => sum + entry.sales,
    0
  );
  const previousTotalOrders = previousSalesData.reduce(
    (sum, entry) => sum + entry.orders,
    0
  );
  const averageOrder = totalOrders
    ? (totalRevenue / totalOrders).toFixed(0)
    : 0;
  const previousAverageOrder = previousTotalOrders
    ? previousTotalRevenue / previousTotalOrders
    : 0;

  const percentRevenueChange =
    ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100;

  const percentOrderChange =
    ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100;

  const percentAverageOrderChange =
    ((averageOrder - previousAverageOrder) / previousAverageOrder) * 100;

  const handleTimeRangeChange = (e) => {
    const newTimeRange = e.target.value;
    setTimeRange(newTimeRange);

    switch (newTimeRange) {
      case "daily":
        setPreviousTimeRange("previous_day");
        break;
      case "weekly":
        setPreviousTimeRange("previous_week");
        break;
      case "monthly":
        setPreviousTimeRange("previous_month");
        break;
      default:
        setPreviousTimeRange("previous_day");
    }
  };

  return (
    <div className="analytics-page">
      <h1>Sales Analytics</h1>
      <div className="time-range-selector">
        <select
          onChange={handleTimeRangeChange}
          value={timeRange}
          className="custom-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="sales-section">
        <SalesChart timeRange={timeRange} />
      </div>
      <div className="analytics-section">
        <div className="orders-data">
          <p>Revenue</p>
          <h1>¥{totalRevenue}</h1>
          <p
            className="change"
            style={{ color: percentRevenueChange >= 0 ? "green" : "red" }}
          >
            {percentRevenueChange.toFixed(2)}% previous 30 days
          </p>
        </div>
        <div className="orders-data">
          <p>Orders</p>
          <h1>{totalOrders}</h1>
          <p
            className="change"
            style={{ color: percentOrderChange >= 0 ? "green" : "red" }}
          >
            {percentOrderChange.toFixed(2)}% previous 30 days
          </p>
        </div>
        <div className="orders-data">
          <p>Average order</p>
          <h1>¥{averageOrder}</h1>
          <p
            className="change"
            style={{ color: percentAverageOrderChange >= 0 ? "green" : "red" }}
          >
            {percentAverageOrderChange.toFixed(2)}% previous 30 days
          </p>
        </div>
      </div>
      <div className="-section">
        <div className="orders-data">
          <p>Revenue</p>
          <h1>¥{totalRevenue}</h1>
          <p
            className="change"
            style={{ color: percentRevenueChange >= 0 ? "green" : "red" }}
          >
            {percentRevenueChange.toFixed(2)}% previous 30 days
          </p>
        </div>
        <div className="orders-data">
          <p>Orders</p>
          <h1>{totalOrders}</h1>
          <p
            className="change"
            style={{ color: percentOrderChange >= 0 ? "green" : "red" }}
          >
            {percentOrderChange.toFixed(2)}% previous 30 days
          </p>
        </div>
        <div className="orders-data">
          <p>Average order</p>
          <h1>¥{averageOrder}</h1>
          <p
            className="change"
            style={{ color: percentAverageOrderChange >= 0 ? "green" : "red" }}
          >
            {percentAverageOrderChange.toFixed(2)}% previous 30 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
