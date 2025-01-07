import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Bill from "./pages/Bill/Bill";
import StoreContextProvider from "./context/StoreContext";
import Footer from "./components/Footer/Footer";
import AdminDashboard from "./admin/pages/AdminDashboard/AdminDashboard";
import ManageOrders from "./admin/pages/ManageOrders/ManageOrders";
import AdminNavbar from "./admin/components/Navbar/AdminNavbar";
import AllOrders from "./admin/pages/AllOrders/AllOrders";
import ManageMenu from "./admin/pages/ManageMenu/ManageMenu";

const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {isAdminPath ? <AdminNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/orders/all" element={<AllOrders />} />
        <Route path="/admin/menu" element={<ManageMenu />} />
      </Routes>

      {!isAdminPath && <Footer />}
    </div>
  );
};

export default App;
