import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Bill from "./pages/Bill/Bill";
import StoreContextProvider from "./context/StoreContext";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <StoreContextProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bill" element={<Bill />} />
        </Routes>
      </div>
      <Footer />
    </StoreContextProvider>
  );
};

export default App;
