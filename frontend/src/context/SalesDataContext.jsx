import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const SalesDataContext = createContext();

const SalesDataProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([]);
  const [previousSalesData, setPreviousSalesData] = useState([]);
  const [timeRange, setTimeRange] = useState("daily");
  const [previousTimeRange, setPreviousTimeRange] = useState("previous_day");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/sales?range=${timeRange}`
        );
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [timeRange]);

  useEffect(() => {
    const fetchPreviousSalesData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/sales?range=${previousTimeRange}`
        );
        setPreviousSalesData(response.data);
      } catch (error) {
        console.error("Error fetching previous sales data:", error);
      }
    };

    fetchPreviousSalesData();
  }, [previousTimeRange]);

  return (
    <SalesDataContext.Provider
      value={{
        salesData,
        timeRange,
        setTimeRange,
        previousTimeRange,
        previousSalesData,
        setPreviousTimeRange,
      }}
    >
      {children}
    </SalesDataContext.Provider>
  );
};

export default SalesDataProvider;
